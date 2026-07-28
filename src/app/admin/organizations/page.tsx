import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin-navbar";

import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

type SearchParams = Promise<{
  search?: string;
  sort?: string;
}>;

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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

  const { search = "", sort = "newest" } =
    await searchParams;

const organizations = await prisma.organization.findMany({        where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            owner: {
              fullName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },

          {
            owner: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      },

      include: {
        owner: true,

        workers: true,

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
    });

const cards = organizations.map(
  (
    organization: (typeof organizations)[number]
  ) => {
        const bookings =
      organization.services.flatMap(
        (service) => service.bookings
      );

    const revenue = bookings.reduce(
      (sum, booking) => {
        if (
          booking.payment &&
          booking.payment.status === "PAID"
        ) {
          return (
            sum +
            booking.payment.amount
          );
        }

        return sum;
      },
      0
    );

    return {
      id: organization.id,

      name: organization.name,

      logo: organization.logo,

      owner: organization.owner.fullName,

      email: organization.owner.email,

      createdAt:
        organization.createdAt,

      workers:
        organization.workers.length,

      services:
        organization.services.length,

      bookings:
        bookings.length,

      revenue,
    };
  });

  switch (sort) {
    case "revenue":
      cards.sort(
        (a, b) =>
          b.revenue - a.revenue
      );
      break;

    case "bookings":
      cards.sort(
        (a, b) =>
          b.bookings - a.bookings
      );
      break;

    case "workers":
      cards.sort(
        (a, b) =>
          b.workers - a.workers
      );
      break;

    case "alphabetical":
      cards.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    case "oldest":
      cards.sort(
        (a, b) =>
          a.createdAt.getTime() -
          b.createdAt.getTime()
      );
      break;

    default:
      cards.sort(
        (a, b) =>
          b.createdAt.getTime() -
          a.createdAt.getTime()
      );
  }

  const totalRevenue = cards.reduce(
    (sum, org) => sum + org.revenue,
    0
  );

  const totalWorkers = cards.reduce(
    (sum, org) => sum + org.workers,
    0
  );

  const totalServices = cards.reduce(
    (sum, org) => sum + org.services,
    0
  );

  return (
    <>      
     <AdminNavbar />
    <main className="mx-auto max-w-7xl p-8">

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Organizations
          </h1>

          <p className="mt-2 text-gray-600">
            View every organization on
            Connect Circle.
          </p>

        </div>

<Link
  href="/admin"
  className="ml-8 rounded-lg border px-5 py-3 hover:bg-orange-200"
>
  ← Back
</Link>
      </div>

<form
  method="GET"
  className="mb-8 flex flex-col gap-4 md:flex-row"
>
  
        <input
          name="search"
          defaultValue={search}
          placeholder="Search organizations, owners, emails..."
          className="flex-1 rounded-lg border px-4 py-3"
        />

        <select
          name="sort"
          defaultValue={sort}
          className="rounded-lg border px-4 py-3"
        >
          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="revenue">
            Highest Revenue
          </option>

          <option value="bookings">
            Most Bookings
          </option>

          <option value="workers">
            Most Employees
          </option>

          <option value="alphabetical">
            A-Z
          </option>

        </select>

        <button className="rounded-lg bg-orange-500 px-6 text-white hover:bg-orange-600">
          Search
        </button>

      </form>
            {cards.length === 0 ? (

        <div className="rounded-xl border bg-blue-200 p-12 text-center">

          <h2 className="text-2xl font-semibold">
            No organizations found
          </h2>

          <p className="mt-2 text-gray-500">
            Try another search.
          </p>

        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {cards.map((organization) => (

            <div
              key={organization.id}
              className="rounded-xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="mb-6 flex items-center gap-4">

                {organization.logo ? (

                  <img
                    src={organization.logo}
                    alt={organization.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />

                ) : (

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">

                    {organization.name.charAt(0)}

                  </div>

                )}

                <div>

                  <h2 className="text-xl font-bold">
                    {organization.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Created{" "}
                    {organization.createdAt.toLocaleDateString()}
                  </p>

                </div>

              </div>

              <div className="space-y-2 text-sm">

                <p>
                  <span className="font-semibold">
                    Owner:
                  </span>{" "}
                  {organization.owner}
                </p>

                <p>
                  <span className="font-semibold">
                    Email:
                  </span>{" "}
                  {organization.email}
                </p>

              </div>

<div className="mt-5 space-y-2 text-sm">

  <p>
    <span className="font-semibold">Workers:</span>{" "}
    {organization.workers}
  </p>

  <p>
    <span className="font-semibold">Services:</span>{" "}
    {organization.services}
  </p>

  <p>
    <span className="font-semibold">Bookings:</span>{" "}
    {organization.bookings}
  </p>

  <p className="border-t pt-2">
    <span className="font-semibold">Revenue:</span>{" "}
    <span className="font-bold text-green-600">
      ${organization.revenue.toLocaleString()}
    </span>
  </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </main>
    </>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border bg-blue-100 p-6 shadow-sm">

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        {value}
      </h2>

    </div>
  );
}

