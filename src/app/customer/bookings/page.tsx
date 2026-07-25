import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

import BookingCard from "./booking-card";
import BookingFilters from "./booking-filters";

type Props = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    organization?: string;
    worker?: string;
    year?: string;
  }>;
};

export default async function CustomerBookingsPage({
  searchParams,
}: Props) {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  const {
    search,
    status,
    organization,
    worker,
    year,
  } = await searchParams;

  const bookings = await prisma.booking.findMany({
    where: {
      profileId: profile.id,
    },
    include: {
      service: {
        include: {
          organization: true,
        },
      },
      worker: {
        include: {
          profile: true,
        },
      },
    },
  });

  const organizations = Array.from(
    new Map(
      bookings
        .filter(
          (booking) =>
            booking.service.organization
        )
        .map((booking) => [
          booking.service.organization!.id,
          booking.service.organization!,
        ])
    ).values()
  );

  const workers = Array.from(
    new Map(
      bookings
        .filter((booking) => booking.worker)
        .map((booking) => [
          booking.worker!.id,
          booking.worker!,
        ])
    ).values()
  );

  let filtered = bookings.filter((booking) => {
    if (
      search &&
      ![
        booking.service.title,
        booking.service.organization?.name,
        booking.worker?.profile.fullName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    ) {
      return false;
    }

    if (
      status &&
      booking.status !== status
    ) {
      return false;
    }

    if (
      organization &&
      booking.service.organization?.id !==
        organization
    ) {
      return false;
    }

    if (
      worker &&
      booking.workerId !== worker
    ) {
      return false;
    }

    if (
      year &&
      booking.date.getFullYear() !==
        Number(year)
    ) {
      return false;
    }

    return true;
  });

  const upcoming = filtered
    .filter(
      (booking) =>
        booking.status === "CONFIRMED"
    )
    .sort(
      (a, b) =>
        a.date.getTime() -
        b.date.getTime()
    );

  const pending = filtered
    .filter(
      (booking) =>
        booking.status === "PENDING"
    )
    .sort(
      (a, b) =>
        b.createdAt.getTime() -
        a.createdAt.getTime()
    );

  const completed = filtered
    .filter(
      (booking) =>
        booking.status === "COMPLETED"
    )
    .sort(
      (a, b) =>
        b.date.getTime() -
        a.date.getTime()
    );

  const cancelled = filtered
    .filter(
      (booking) =>
        booking.status === "CANCELLED"
    )
    .sort(
      (a, b) =>
        b.date.getTime() -
        a.date.getTime()
    );

  const total =
    upcoming.length +
    pending.length +
    completed.length +
    cancelled.length;
      return (
    <main className="mx-auto max-w-7xl p-8">

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          My Bookings
        </h1>

        <p className="mt-2 text-gray-600">
          Track your upcoming and previous appointments in one place.
        </p>

      </div>

      <BookingFilters
        organizations={organizations}
        workers={workers}
      />

      {total === 0 ? (

        <div className="mt-8 rounded-2xl border bg-white p-12 text-center shadow-sm">

          <h2 className="text-2xl font-semibold">
            No bookings found
          </h2>

          <p className="mt-3 text-gray-500">
            Try adjusting your filters or book your first appointment.
          </p>

        </div>

      ) : (

        <div className="mt-8 space-y-12">

          {upcoming.length > 0 && (

            <section>

              <div className="mb-5 flex items-center gap-3">

                <h2 className="text-2xl font-bold">
                  Upcoming
                </h2>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  {upcoming.length}
                </span>

              </div>

              <div className="space-y-4">

                {upcoming.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                  />
                ))}

              </div>

            </section>

          )}

          {pending.length > 0 && (

            <section>

              <div className="mb-5 flex items-center gap-3">

                <h2 className="text-2xl font-bold">
                  Pending
                </h2>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                  {pending.length}
                </span>

              </div>

              <div className="space-y-4">

                {pending.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                  />
                ))}

              </div>

            </section>

          )}

          {completed.length > 0 && (

            <section>

              <div className="mb-5 flex items-center gap-3">

                <h2 className="text-2xl font-bold">
                  Completed
                </h2>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  {completed.length}
                </span>

              </div>

              <div className="space-y-4">

                {completed.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                  />
                ))}

              </div>

            </section>

          )}
                    {cancelled.length > 0 && (

            <section>

              <div className="mb-5 flex items-center gap-3">

                <h2 className="text-2xl font-bold">
                  Cancelled
                </h2>

                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                  {cancelled.length}
                </span>

              </div>

              <div className="space-y-4">

                {cancelled.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                  />
                ))}

              </div>

            </section>

          )}

        </div>

      )}

    </main>
  );
}
