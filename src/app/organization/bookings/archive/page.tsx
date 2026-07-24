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
                <strong>Worker:</strong>{" "}
                {booking.worker?.profile.fullName ??
                  "Unassigned"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {booking.status}
              </p>

              <p>
                <strong>Archived:</strong>{" "}
                {booking.organizationArchivedAt?.toLocaleString()}
              </p>

{booking.status === "CANCELLED" &&
 booking.cancellationReason && (
      <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
    <h3 className="font-semibold text-red-700">
      Cancellation Reason
    </h3>

    <p className="mt-2">
      {booking.cancellationReason}
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

