import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export default async function OrganizationBookingsPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const organization = await prisma.organization.findFirst({
    where: {
      ownerId: profile.id,
    },
    include: {
      services: {
        include: {
          bookings: {
            include: {
              profile: true,
              worker: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!organization) {
    return <p>Organization not found.</p>;
  }

  const bookings = organization.services.flatMap((service) =>
    service.bookings.map((booking) => ({
      ...booking,
      service,
    }))
  );

  bookings.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <main className="mx-auto max-w-7xl p-8">
      <h1 className="mb-2 text-4xl font-bold">
        Bookings
      </h1>

      <p className="mb-8 text-gray-600">
        Manage appointments across your organization.
      </p>

      {bookings.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          No bookings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/organization/bookings/${booking.id}`}
              className="block rounded-xl border bg-white p-6 shadow-sm hover:border-orange-500"
            >
              <h2 className="text-xl font-semibold">
                {booking.service.title}
              </h2>

              <p className="mt-2">
                <strong>Customer:</strong>{" "}
                {booking.profile.fullName}
              </p>

              <p>
                <strong>Worker:</strong>{" "}
                {booking.worker?.profile.fullName ??
                  "Unassigned"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {booking.date.toLocaleString()}
              </p>

              <p className="mt-3 inline-block rounded bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                {booking.status}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}