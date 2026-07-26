import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import WorkerArchiveBooking from "./worker-archive-booking";
import WorkerBookingFilters from "./booking-filters";
import WorkerNavbar from "@/components/worker-navbar";

type Props = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    service?: string;
  }>;
};

export default async function WorkerBookingsPage({
  searchParams,
}: Props) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const worker = await prisma.worker.findUnique({
    where: {
      profileId: profile.id,
    },
  });

  if (!worker) {
    return <p>Worker not found.</p>;
  }

  const { search, status, service } = await searchParams;

  const bookings = await prisma.booking.findMany({
    where: {
      workerId: worker.id,
      workerArchivedAt: null,
    },
include: {
  profile: true,
  payment: true,
  service: {
    include: {
      organization: true,
    },
  },
},    orderBy: {
      date: "asc",
    },
  });

  const services = [
    ...new Map(
      bookings.map((booking) => [
        booking.service.id,
        booking.service,
      ])
    ).values(),
  ];

  const filteredBookings = bookings.filter((booking) => {
    if (
      search &&
      !booking.profile.fullName
        .toLowerCase()
        .includes(search.toLowerCase())
    ) {
      return false;
    }

    if (status && booking.status !== status) {
      return false;
    }

    if (service && booking.serviceId !== service) {
      return false;
    }

    return true;
  });

  const upcoming = filteredBookings
  .filter((b) => b.status === "CONFIRMED")
  .sort((a, b) => a.date.getTime() - b.date.getTime());

const pending = filteredBookings
  .filter((b) => b.status === "PENDING")
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

const paymentPending = filteredBookings
  .filter((b) => b.status === "PENDING_PAYMENT")
  .sort((a, b) => b.date.getTime() - a.date.getTime());

const completed = filteredBookings
  .filter((b) => b.status === "COMPLETED")
  .sort((a, b) => b.date.getTime() - a.date.getTime());

const cancelled = filteredBookings
  .filter((b) => b.status === "CANCELLED")
  .sort((a, b) => b.date.getTime() - a.date.getTime());

const total =
  upcoming.length +
  pending.length +
  paymentPending.length +
  completed.length +
  cancelled.length;

  return (
    <main className="mx-auto max-w-7xl p-8">

            <WorkerNavbar />

      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            My Bookings
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage your assigned appointments.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/worker/bookings/archive"
            className="rounded-lg border px-5 py-3 hover:bg-gray-50"
          >
            Archived
          </Link>

          <Link
            href="/worker"
            className="rounded-lg border px-5 py-3 hover:bg-gray-50"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <WorkerBookingFilters
        services={services}
      />

{total === 0 ? (
          <div className="mt-8 rounded-xl border bg-white p-8 shadow-sm">
          No bookings found.
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

  {paymentPending.length > 0 && (
    <BookingSection
      title="Payment Pending"
      color="orange"
      bookings={paymentPending}
    />
  )}

  {completed.length > 0 && (
    <BookingSection
      title="Completed"
      color="green"
      bookings={completed}
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
}
      
function BookingSection({
  title,
  color,
  bookings,
}: {
  title: string;
  color: "blue" | "yellow" | "green" | "orange" | "red";
  bookings: any[];
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
                      Appointment
                    </p>

<p className="mt-1 font-medium">
  {booking.date.toLocaleString()}{" "}
  <span className="text-sm text-gray-500">
    ({booking.service.organization?.timezone ?? "No timezone"})
  </span>
</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Payment
                    </p>

                    <p className="mt-1 font-medium">
                      ${booking.service.price}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Status
                    </p>

                    <p className="mt-1 font-medium">
                      {booking.status.replaceAll("_", " ")}
                    </p>
                  </div>

                  {booking.notes && (
                    <div className="md:col-span-2 rounded-lg border bg-yellow-50 p-4">
                      <h3 className="font-semibold">
                        Customer Notes
                      </h3>

                      <p className="mt-2">
                        {booking.notes}
                      </p>
                    </div>
                  )}

                  {booking.organizationNotes && (
                    <div className="md:col-span-2 rounded-lg border bg-orange-50 p-4">
                      <h3 className="font-semibold">
                        Organization Notes
                      </h3>

                      <p className="mt-2">
                        {booking.organizationNotes}
                      </p>
                    </div>
                  )}
                                    {booking.workerCancellationReason && (
                    <div className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 p-4">
                      <h3 className="font-semibold text-red-700">
                        Cancelled by You
                      </h3>

                      <p className="mt-2">
                        {booking.workerCancellationReason}
                      </p>
                    </div>
                  )}

                  {booking.customerCancellationReason && (
                    <div className="md:col-span-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <h3 className="font-semibold text-blue-700">
                        Cancelled by Customer
                      </h3>

                      <p className="mt-2">
                        {booking.customerCancellationReason}
                      </p>
                    </div>
                  )}

                  {booking.cancellationReason && (
                    <div className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 p-4">
                      <h3 className="font-semibold text-red-700">
                        Cancelled by Organization
                      </h3>

                      <p className="mt-2">
                        {booking.cancellationReason}
                      </p>
                    </div>
                  )}

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
                    }`}
                />

                {booking.status.replaceAll("_", " ")}
              </span>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href={`/worker/bookings/${booking.id}`}
                className="rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
              >
                Open Booking
              </Link>

              {(booking.status === "COMPLETED" ||
                booking.status === "CANCELLED") &&
                !booking.workerArchivedAt && (
                  <WorkerArchiveBooking
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
