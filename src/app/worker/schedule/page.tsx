import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export default async function WorkerSchedulePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const worker = await prisma.worker.findUnique({
    where: {
      profileId: profile.id,
    },
    include: {
      bookings: {
        include: {
          profile: true,
          service: true,
        },
        orderBy: {
          date: "asc",
        },
      },
    },
  });

  if (!worker) {
    return <p>Worker not found.</p>;
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-2 text-4xl font-bold">
        My Schedule
      </h1>

      <p className="mb-8 text-gray-600">
        Upcoming appointments assigned to you.
      </p>

      {worker.bookings.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          No appointments scheduled.
        </div>
      ) : (
        <div className="space-y-4">
          {worker.bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {booking.service.title}
              </h2>

              <p className="mt-2">
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}