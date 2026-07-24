import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import WorkerArchiveBooking from "./worker-archive-booking";
import WorkerBookingFilters from "./booking-filters";

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
      service: true,
      payment: true,
    },
    orderBy: {
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

  return (
    <main className="mx-auto max-w-7xl p-8">
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

      {filteredBookings.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-8 shadow-sm">
          No bookings found.
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {booking.service.title}
                  </h2>

                  <p className="mt-3">
                    <strong>Customer:</strong>{" "}
                    {booking.profile.fullName}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {booking.date.toLocaleString()}
                  </p>

                  <p>
                    <strong>Payment:</strong>{" "}
                    {booking.payment?.status ??
                      "No payment"}
                  </p>
                </div>

                <span
                  className={`inline-flex h-7 items-center gap-2 rounded-full px-3 text-xs font-semibold whitespace-nowrap
                    ${
                      booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : booking.status ===
                          "CONFIRMED"
                        ? "bg-blue-100 text-blue-700"
                        : booking.status ===
                          "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full
                      ${
                        booking.status ===
                        "PENDING"
                          ? "bg-yellow-500"
                          : booking.status ===
                            "CONFIRMED"
                          ? "bg-blue-500"
                          : booking.status ===
                            "COMPLETED"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                  />

                  {booking.status.replace("_", " ")}
                </span>
              </div>

              {booking.organizationNotes && (
                <div className="mt-5 rounded-lg border bg-orange-50 p-4">
                  <h3 className="font-semibold">
                    Organization Notes
                  </h3>

                  <p className="mt-2">
                    {booking.organizationNotes}
                  </p>
                </div>
              )}

              {booking.notes && (
                <div className="mt-4 rounded-lg border bg-gray-50 p-4">
                  <h3 className="font-semibold">
                    Customer Notes
                  </h3>

                  <p className="mt-2">
                    {booking.notes}
                  </p>
                </div>
              )}

              {booking.workerCancellationReason && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <h3 className="font-semibold text-red-700">
                    Cancelled by You
                  </h3>

                  <p className="mt-2">
                    {
                      booking.workerCancellationReason
                    }
                  </p>
                </div>
              )}

              {booking.cancellationReason && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <h3 className="font-semibold text-red-700">
                    Cancelled by Organization
                  </h3>

                  <p className="mt-2">
                    {booking.cancellationReason}
                  </p>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/worker/bookings/${booking.id}`}
                  className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600"
                >
                  Open Booking
                </Link>

                {(booking.status ===
                  "COMPLETED" ||
                  booking.status ===
                    "CANCELLED") &&
                  !booking.workerArchivedAt && (
                    <WorkerArchiveBooking
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
