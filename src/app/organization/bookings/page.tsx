import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

import BookingFilters from "./booking-filters";
import ArchiveBookingButton from "./archive-booking-button";
import OrganizationNavbar from "@/components/organization-navbar";

type Props = {
  searchParams: Promise<{
    status?: string;
    worker?: string;
    service?: string;
    search?: string;
  }>;
};

function relativeDate(date: Date) {
  const now = new Date();

  const diff = date.getTime() - now.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (Math.abs(minutes) < 60) {
    return minutes >= 0
      ? `in ${minutes} min`
      : `${Math.abs(minutes)} min ago`;
  }

  if (Math.abs(hours) < 24) {
    return hours >= 0
      ? `in ${hours} hr`
      : `${Math.abs(hours)} hr ago`;
  }

  if (Math.abs(days) < 7) {
    return days >= 0
      ? `in ${days} day${days === 1 ? "" : "s"}`
      : `${Math.abs(days)} day${
          Math.abs(days) === 1 ? "" : "s"
        } ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
  });
}

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

  const organization =
    await prisma.organization.findFirst({
      where: {
        ownerId: profile.id,
      },
      include: {
        services: {
          include: {
            bookings: {
              include: {
                profile: true,

                payment: true,

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

  const workers =
    await prisma.worker.findMany({
      include: {
        profile: true,
      },
    });

  const services = organization.services;

  let bookings =
    organization.services.flatMap((serviceItem) =>
      serviceItem.bookings.map((booking) => ({
        ...booking,
        service: serviceItem,
      }))
    );

  bookings = bookings
  .filter(
    (booking) =>
      booking.organizationArchivedAt === null
  )
  .filter((booking) => {
if (status && booking.status !== status) {
  return false;
}
    if (
      worker &&
      booking.workerId !== worker
    ) {
      return false;
    }

    if (
      service &&
      booking.serviceId !== service
    ) {
      return false;
    }

    if (
      search &&
      ![
        booking.profile.fullName,
        booking.worker?.profile.fullName,
        booking.service.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
  const upcoming = bookings
    .filter(
      (booking) =>
        booking.status === "CONFIRMED"
    )
    .sort(
      (a, b) =>
        a.date.getTime() -
        b.date.getTime()
    );

  const pending = bookings
    .filter(
      (booking) =>
        booking.status === "PENDING"
    )
    .sort(
      (a, b) =>
        b.createdAt.getTime() -
        a.createdAt.getTime()
    );

const completed = bookings
  .filter(
    (booking) =>
      booking.status === "COMPLETED"
  )
  .sort(
    (a, b) =>
      b.date.getTime() - a.date.getTime()
  );

const paymentPending = bookings
  .filter(
    (booking) =>
      booking.status === "PENDING_PAYMENT"
  )
  .sort(
    (a, b) =>
      b.date.getTime() - a.date.getTime()
  );

  const cancelled = bookings
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
  paymentPending.length +
  cancelled.length;
        return (
    <main className="mx-auto max-w-7xl p-8">
            <OrganizationNavbar />
      <div className="mb-10 flex items-center justify-between">
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
          className="rounded-xl border px-5 py-3 hover:bg-gray-50"
        >
          Archived Bookings
        </Link>
      </div>

      <BookingFilters
        workers={workers}
        services={services}
      />

      {total === 0 ? (
        <div className="mt-8 rounded-2xl border bg-white p-12 text-center shadow-sm">
          <h2 className="text-2xl font-semibold">
            No bookings found
          </h2>

          <p className="mt-3 text-gray-500">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-12">

          {upcoming.length > 0 && (
            <BookingSection
              title="Upcoming"
              color="blue"
              bookings={upcoming}
            />
          )}

          {pending.length > 0 && (
            <BookingSection
              title="Pending"
              color="yellow"
              bookings={pending}
            />
          )}

          {completed.length > 0 && (
            <BookingSection
              title="Completed"
              color="green"
              bookings={completed}
            />
          )}

{paymentPending.length > 0 && (
  <BookingSection
    title="Payment Pending"
    color="orange"
    bookings={paymentPending}
  />
)}
          {cancelled.length > 0 && (
            <BookingSection
              title="Cancelled"
              color="red"
              bookings={cancelled}
            />
          )}

        </div>
      )}
    </main>
  );

  function BookingSection({
    title,
    color,
    bookings,
  }: {
    title: string;
    color: "blue" | "yellow" | "green" | "red" | "orange";
    bookings: typeof upcoming;
  }) {
const badge =
  color === "blue"
    ? "bg-blue-100 text-blue-700"
    : color === "yellow"
    ? "bg-yellow-100 text-yellow-700"
    : color === "green"
    ? "bg-green-100 text-green-700"
    : color === "orange"
    ? "bg-orange-100 text-orange-700"
    : "bg-red-100 text-red-700";
    
    return (
      <section>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${badge}`}
          >
            {bookings.length}
          </span>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-6">

                <div className="flex-1">

                  <div className="flex items-center gap-3">

                    <h3 className="text-xl font-bold">
                      {booking.service.title}
                    </h3>

                    <span className="text-sm text-gray-500">
                      {relativeDate(booking.date)}
                    </span>

                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">

                    <div>

                      <p className="text-sm font-semibold text-gray-500">
                        Customer
                      </p>

                      <p className="mt-1 font-medium">
                        {booking.profile.fullName}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-500">
                        Worker
                      </p>

                      <p className="mt-1 font-medium">
                        {booking.worker?.profile.fullName ??
                          "Unassigned"}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-500">
                        Appointment
                      </p>

                      <p className="mt-1 font-medium">
                        {booking.date.toLocaleString()}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-500">
                        Payment
                      </p>

<p className="mt-1 font-medium">
  Expected Payment: ${booking.service.price}
</p>
                    </div>

     <div>
              {booking.notes && (
                <div className="mt-4 rounded-lg border bg-yellow-50 p-4">
                  <h3 className="font-semibold">
                    Customer Notes
                  </h3>

                  <p className="mt-2">
                    {booking.notes}
                  </p>
                </div>
              )}
        </div>
                  </div>

                </div>

                <span
className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap
${
  booking.status === "PENDING"
    ? "bg-yellow-100 text-yellow-700"
    : booking.status === "CONFIRMED"
    ? "bg-blue-100 text-blue-700"
    : booking.status === "PENDING_PAYMENT"
    ? "bg-orange-100 text-orange-700"
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
    : booking.status === "PENDING_PAYMENT"
    ? "bg-orange-500"
    : booking.status === "COMPLETED"
    ? "bg-green-500"
    : "bg-red-500"
}`}                  />

                  {booking.status.replace("_", " ")}

                </span>

              </div>

              <div className="mt-6 flex gap-3">

                <Link
                  href={`/organization/bookings/${booking.id}`}
                  className="rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
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
      </section>
    );
  }
}
    