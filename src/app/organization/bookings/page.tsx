import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import BookingFilters from "./booking-filters";
import ArchiveBookingButton from "./archive-booking-button";

type Props = {
  searchParams: Promise<{
    status?: string;
    worker?: string;
    service?: string;
    search?: string;
  }>;
};

export default async function OrganizationBookingsPage({
  searchParams,
}: Props) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const {
    status,
    worker,
    service,
    search,
  } = await searchParams;

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

  const workers = await prisma.worker.findMany({
    include: {
      profile: true,
    },
  });

  const services = organization.services;

  let bookings = organization.services.flatMap((serviceItem) =>
    serviceItem.bookings.map((booking) => ({
      ...booking,
      service: serviceItem,
    }))
  );

  bookings = bookings
    .filter((booking) => booking.deletedAt === null)
    .filter((booking) => {
      if (status && booking.status !== status) return false;

      if (worker && booking.workerId !== worker) return false;

      if (service && booking.serviceId !== service) return false;

      if (
        search &&
        !booking.profile.fullName
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

  bookings.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <main className="mx-auto max-w-7xl p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Bookings
          </h1>

          <p className="mt-2 text-gray-600">
            Manage appointments across your organization.
          </p>
        </div>

        <Link
          href="/organization/bookings/archive"
          className="rounded-lg border px-5 py-3 hover:bg-gray-50"
        >
          Archived Bookings
        </Link>

      </div>

      <BookingFilters
        workers={workers}
        services={services}
      />

      {bookings.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-8 shadow-sm">
          No bookings found.
        </div>
      ) : (
        <div className="mt-8 space-y-4">

          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >

<div className="flex items-start justify-between gap-6">

                <div>

                  <h2 className="text-xl font-semibold">
                    {booking.service.title}
                  </h2>

                  <p className="mt-3">
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

                </div>

<span
  className={`inline-flex h-7 items-center gap-2 rounded-full px-3 text-xs font-semibold whitespace-nowrap
    ${
      booking.status === "PENDING"
        ? "bg-yellow-100 text-yellow-700"
        : booking.status === "CONFIRMED"
        ? "bg-blue-100 text-blue-700"
        : booking.status === "COMPLETED"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
>
  <span
    className={`h-2 w-2 rounded-full
      ${
        booking.status === "PENDING"
          ? "bg-yellow-500"
          : booking.status === "CONFIRMED"
          ? "bg-blue-500"
          : booking.status === "COMPLETED"
          ? "bg-green-500"
          : "bg-red-500"
      }`}
  />
  {booking.status.replace("_", " ")}
</span>
              </div>

              <div className="mt-6 flex gap-3">

                <Link
                  href={`/organization/bookings/${booking.id}`}
                  className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
                >
                  Open Booking
                </Link>

                {(booking.status === "COMPLETED" ||
                  booking.status === "CANCELLED") && (
                  <ArchiveBookingButton
                    bookingId={booking.id}
                  />
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}

