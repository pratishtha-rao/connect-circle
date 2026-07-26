import { prisma } from "@/lib/prisma";
import UnarchiveBooking from "./unarchive-booking";

export default async function ArchiveBookingsPage() {
const bookings = await prisma.booking.findMany({
  where: {
    organizationArchivedAt: {
      not: null,
    },
  },

  include: {
    profile: true,

    service: true,

    worker: {
      include: {
        profile: true,
      },
    },
  },

  orderBy: {
    organizationArchivedAt: "desc",
  },
});

return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="mb-8 text-4xl font-bold">
        Archived Bookings
      </h1>

      {bookings.length === 0 ? (
        <p>No archived bookings.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {booking.service.title}
              </h2>

              <p>
                <strong>Customer:</strong>{" "}
                {booking.profile.fullName}
              </p>

              <p>
                <strong>Employee:</strong>{" "}
                {booking.worker?.profile.fullName ??
                  "Unassigned"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {booking.status}
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

{booking.customerCancellationReason && (
  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
    <h3 className="font-semibold text-blue-700">
      Cancelled by Customer
    </h3>

    <p className="mt-2">
      {booking.customerCancellationReason}
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

              <UnarchiveBooking
                bookingId={booking.id}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

