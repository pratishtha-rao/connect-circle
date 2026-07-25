import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/");
  }

  const admin = await prisma.admin.findUnique({
    where: {
      email: profile.email,
    },
  });

  if (!admin) {
    redirect("/");
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalWorkers,
    totalOrganizations,
    totalBookings,

    usersThisMonth,
    workersThisMonth,
    organizationsThisMonth,
    bookingsThisMonth,

    customerCount,

    totalRevenue,
    monthlyRevenue,

    organizations,
  ] = await Promise.all([
    prisma.profile.count(),

    prisma.worker.count(),

    prisma.organization.count(),

    prisma.booking.count(),

    prisma.profile.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),

    prisma.worker.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),

    prisma.organization.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),

    prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),

    prisma.profile.count({
      where: {
        worker: null,
        organization: null,
      },
    }),

    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "PAID",
      },
    }),

    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "PAID",
        paidAt: {
          gte: startOfMonth,
        },
      },
    }),

    prisma.organization.findMany({
      include: {
        services: {
          include: {
            bookings: {
              include: {
                payment: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const organizationAnalytics = organizations.map((organization) => {
    const bookings = organization.services.flatMap(
      (service) => service.bookings
    );

    const revenue = bookings.reduce((sum, booking) => {
      if (
        booking.payment &&
        booking.payment.status === "PAID"
      ) {
        return sum + booking.payment.amount;
      }

      return sum;
    }, 0);

    return {
      id: organization.id,
      name: organization.name,
      bookings: bookings.length,
      revenue,
    };
  });

  const mostProfitableOrganizations = [...organizationAnalytics]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const mostActiveOrganizations = [...organizationAnalytics]
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  return (
    <main className="mx-auto max-w-7xl p-8">

      <div className="mb-10 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Super Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Platform analytics and management
          </p>
        </div>

        <Link
          href="/admin/organizations"
          className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Manage Organizations
        </Link>

      </div>

      <h2 className="mb-6 text-2xl font-bold">
        Overall Platform Stats
      </h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Registered Accounts"
          value={totalUsers}
        />

        <StatCard
          title="Customers"
          value={customerCount}
        />

        <StatCard
          title="Workers"
          value={totalWorkers}
        />

        <StatCard
          title="Organizations"
          value={totalOrganizations}
        />

        <StatCard
          title="Bookings"
          value={totalBookings}
        />

        <StatCard
          title="Total Revenue"
          value={`$${(
            totalRevenue._sum.amount ?? 0
          ).toLocaleString()}`}
        />

      </div>

      <h2 className="mt-12 mb-6 text-2xl font-bold">
        Monthly Growth
      </h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="New Accounts"
          value={usersThisMonth}
        />

        <StatCard
          title="New Workers"
          value={workersThisMonth}
        />

        <StatCard
          title="New Organizations"
          value={organizationsThisMonth}
        />

        <StatCard
          title="Bookings"
          value={bookingsThisMonth}
        />

        <StatCard
          title="Monthly Revenue"
          value={`$${(
            monthlyRevenue._sum.amount ?? 0
          ).toLocaleString()}`}
        />

      </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-2xl font-bold">
            Most Profitable Organizations
          </h2>

          <div className="space-y-4">

            {mostProfitableOrganizations.length === 0 ? (
              <p className="text-gray-500">
                No revenue yet.
              </p>
            ) : (
              mostProfitableOrganizations.map((organization) => (
                <div
                  key={organization.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>

                    <p className="font-semibold">
                      {organization.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {organization.bookings} bookings
                    </p>

                  </div>

                  <span className="font-bold text-green-600">
                    ${organization.revenue.toLocaleString()}
                  </span>

                </div>
              ))
            )}

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-2xl font-bold">
            Most Active Organizations
          </h2>

          <div className="space-y-4">

            {mostActiveOrganizations.length === 0 ? (
              <p className="text-gray-500">
                No bookings yet.
              </p>
            ) : (
              mostActiveOrganizations.map((organization) => (
                <div
                  key={organization.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <span className="font-semibold">
                    {organization.name}
                  </span>

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                    {organization.bookings} bookings
                  </span>

                </div>
              ))
            )}

          </div>

        </div>

      </div>

    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <h3 className="mt-3 text-4xl font-bold tracking-tight">
        {value}
      </h3>

    </div>
  );
}