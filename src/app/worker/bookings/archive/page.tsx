import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import UnarchiveBooking from "./unarchive-booking";

export default async function WorkerArchivedBookingsPage() {
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

  const bookings = await prisma.booking.findMany({
    where: {
      workerId: worker.id,
      workerArchivedAt: {
        not: null,
      },
    },
    include: {
      profile: true,
      service: true,
      payment: true,
    },
    orderBy: {
      workerArchivedAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Archived Bookings
          </h1>

          <p className="mt-2 text-gray-600">
            Bookings you've archived.
          </p>
        </div>

        <Link
          href="/worker/bookings"
          className="rounded-lg border px-5 py-3 hover:bg-gray-50"
        >
          Back to Bookings
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          No archived bookings.
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
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
                <strong>Status:</strong>{" "}
                {booking.status}
              </p>

              <p>
                <strong>Payment:</strong>{" "}
                {booking.payment?.status ?? "No payment"}
              </p>

              {booking.organizationNotes && (
                <div className="mt-4 rounded-lg border bg-orange-50 p-4">
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

              {booking.workerCancellationReason && (
                <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <h3 className="font-semibold text-yellow-700">
                    Cancelled by You
                  </h3>

                  <p className="mt-2">
                    {booking.workerCancellationReason}
                  </p>
                </div>
              )}

              <div className="mt-6">
                <UnarchiveBooking
                  bookingId={booking.id}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
