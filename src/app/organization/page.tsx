import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import { redirect } from "next/navigation";
import OrganizationNavbar from "@/components/organization-navbar";

export default async function OrganizationPage() {
  const profile = await getCurrentProfile();

if (!profile) {
  redirect("/");
}

const organization =
  await prisma.organization.findUnique({
    where: {
      ownerId: profile.id,
    },

    include: {
      workers: true,

      services: {
        include: {
          bookings: {
            include: {
              payment: true,
              service: true,
            },
          },
        },
      },
    },
  });

if (!organization) {
  redirect("/");
}

const bookings = organization.services.flatMap(
  (service) =>
    service.bookings.map((booking) => ({
      ...booking,
      service,
    }))
);  
const totalBookings = bookings.length;

const activeWorkers =
  organization.workers.length;

const totalServices =
  organization.services.length;

const revenue = bookings.reduce((sum, booking) => {
  if (
    booking.status === "CONFIRMED" ||
    booking.status === "COMPLETED"
  ) {
    return sum + booking.service.price;
  }

  return sum;
}, 0);

const startOfMonth = new Date();

startOfMonth.setDate(1);

startOfMonth.setHours(
  0,
  0,
  0,
  0
);

const monthlyBookings =
  bookings.filter(
    (booking) =>
      booking.createdAt >=
      startOfMonth
  );

const monthlyRevenue = monthlyBookings.reduce(
  (sum, booking) => {
    if (
      booking.status === "CONFIRMED" ||
      booking.status === "COMPLETED"
    ) {
      return sum + booking.service.price;
    }

    return sum;
  },
  0
);

const revenueBookings = bookings.filter(
  (booking) =>
    booking.status === "CONFIRMED" ||
    booking.status === "COMPLETED"
);

const averageBookingValue =
  revenueBookings.length === 0
    ? 0
    : revenue / revenueBookings.length;
    
    const mostBookedService =
  organization.services
    .map((service) => ({
      title: service.title,
      bookings:
        service.bookings.length,
    }))
    .sort(
      (a, b) =>
        b.bookings - a.bookings
    )[0];

    const today = new Date();

today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);

tomorrow.setDate(
  tomorrow.getDate() + 1
);

const todaysBookings =
  bookings.filter(
    (booking) =>
      booking.date >= today &&
      booking.date < tomorrow
  );

    return (
<>       <OrganizationNavbar />

    <main className="mx-auto max-w-7xl p-8">

      <h1 className="text-4xl font-bold text-gray-900">
        Organization Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Welcome back. Manage every part of your business from one place.
      </p>


{/* Analytics */}

<h2 className="mt-10 mb-6 text-2xl font-bold">
  Overview
</h2>

<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
  
  <StatCard
    title="Total Bookings"
    value={totalBookings}
  />

  <StatCard
    title="Bookings This Month"
    value={monthlyBookings.length}
  />
<StatCard
  title="Total Revenue"
  value={`$${revenue.toLocaleString()}`}
  subtitle="Expected from confirmed & completed bookings"
/>

<StatCard
  title="Monthly Revenue"
  value={`$${monthlyRevenue.toLocaleString()}`}
  subtitle="Expected this month from confirmed & completed bookings"
/>

  <StatCard
    title="Active Workers"
    value={activeWorkers}
  />

  <StatCard
    title="Services"
    value={totalServices}
  />

  <StatCard
    title="Today's Bookings"
    value={todaysBookings.length}
  />

  <StatCard
    title="Average Booking"
    value={`$${averageBookingValue.toFixed(2)}`}
  />

</div>

<div className="mt-8 rounded-2xl border bg-blue-100 p-6 shadow-sm">

  <h2 className="text-2xl font-semibold">
    Most Booked Service
  </h2>

  {mostBookedService ? (

    <div className="mt-4">

      <p className="text-xl font-bold">
        {mostBookedService.title}
      </p>

      <p className="mt-1 text-gray-600">
        {mostBookedService.bookings} bookings
      </p>

    </div>

  ) : (

    <p className="mt-4 text-gray-500">
      No bookings yet.
    </p>

  )}

</div>

  
<h2 className="mt-12 mb-6 text-2xl font-bold">
  Management
</h2>

<div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {/* Bookings */}

        <section className="rounded-2xl border bg-blue-100 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Bookings
          </h2>

          <p className="mt-2 text-black-600">
            Manage appointments, confirmations, cancellations and archives.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              href="/organization/bookings"
              className="rounded-lg bg-orange-500 px-5 py-3 font-timesnewroman text-white hover:bg-orange-600"
            >
              View Bookings
            </Link>

            <Link
              href="/organization/bookings/archive"
              className="rounded-lg bg-orange-500 px-5 py-3 font-timesnewroman text-white hover:bg-orange-600"
            >
              Archived Bookings
            </Link>

          </div>
        </section>

        {/* Services */}

        <section className="rounded-2xl border bg-blue-100 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Services
          </h2>

          <p className="mt-2 text-black-600">
            Create and manage all services offered by your organization.
          </p>

          <Link
            href="/organization/services"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-timesnewroman text-white hover:bg-orange-600"
          >
            Manage Services
          </Link>
        </section>

        {/* Workers */}

        <section className="rounded-2xl border bg-blue-100 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Employee
          </h2>

          <p className="mt-2 text-black-600">
            Add employees, assign bookings and manage schedules.
          </p>

          <Link
            href="/organization/workers"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-timesnewroman text-white hover:bg-orange-600"
          >
            Manage Employees
          </Link>
        </section>

        {/* Categories */}

        <section className="rounded-2xl border bg-blue-100 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Categories
          </h2>

          <p className="mt-2 text-black-600">
            Organize your services into categories.
          </p>

          <Link
            href="/organization/categories"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-timesnewroman text-white hover:bg-orange-600"
          >
            Manage Categories
          </Link>
        </section>

  {/*
        **CALENDAR**

        <section className="rounded-2xl border bg-blue-100 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Calendar
          </h2>

          <p className="mt-2 text-black-600">
            View appointments by day, week or month.
          </p>

          <Link
            href="/organization/calendar"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-timesnewroman text-white hover:bg-orange-600"
          >
            Open Calendar
          </Link>
        </section>

  */}

        {/* Settings */}

        <section className="rounded-2xl border bg-blue-100 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Settings
          </h2>

          <p className="mt-2 text-black-600">
            Update organization information and preferences.
          </p>

          <Link
            href="/organization/settings"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-timesnewroman text-white hover:bg-orange-600"
          >
            Organization Settings
          </Link>
        </section>

      </div>

    </main>
    </>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="rounded-xl border bg-blue-100 px-5 py-4 shadow-sm">

      <p className="text-xs uppercase tracking-wide text-black">
        {title}
      </p>

      <h3 className="mt-1 text-3xl font-bold">
        {value}
      </h3>

      {subtitle && (
        <p className="mt-2 text-sm text-gray-500">
          {subtitle}
        </p>
      )}

    </div>
    
  );
}
