import Link from "next/link";
import WorkerNavbar from "@/components/worker-navbar";
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
          service: {
            include: {
              organization: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      },
    },
  });

  if (!worker) {
    return <p>Employee not found.</p>;
  }

  const activeBookings = worker.bookings.filter(
    (booking) => booking.workerArchivedAt === null
  );

  const confirmedBookings = activeBookings.filter(
    (booking) => booking.status === "CONFIRMED"
  );

  return (
    <>
      <WorkerNavbar />

      <main className="mx-auto max-w-5xl p-8">
        <h1 className="mb-2 text-4xl font-bold">
          My Schedule
        </h1>

        <p className="mb-8 text-gray-600">
          Upcoming appointments assigned to you.
        </p>

        {confirmedBookings.length === 0 ? (
          <div className="rounded-xl border bg-blue-100 p-8 shadow-sm">
            No confirmed appointments.
          </div>
        ) : (
          <>
            <h2 className="mb-6 text-2xl font-semibold">
              Upcoming Appointments
            </h2>

            <div className="space-y-6">
{confirmedBookings.map((booking) => (
  <div
    key={booking.id}
    className="rounded-xl border bg-blue-100 p-8 shadow-sm"
  >
    {/* Service */}
    <h3 className="text-2xl font-bold text-black-800">
      {booking.service.title}
    </h3>

    {/* Customer */}
    <p className="mt-2 text-lg text-gray-800">
      <span className="font-semibold">Customer:</span>{" "}
      {booking.profile.fullName}
    </p>

    {/* Date */}
    <p className="mt-4 font-medium text-black-600">
      {booking.date.toLocaleString()}{" "}
      <span className="text-sm text-black">
        ({booking.service.organization?.timezone ?? "No timezone"})
      </span>
    </p>

    {/* Customer Notes */}
    <div className="mt-6">
      <p className="font-semibold text-gray-900">
        Customer Notes
      </p>

      <div className="mt-2 rounded-lg border bg-yellow-50 p-4">
        {booking.notes?.trim() ? (
          <p>{booking.notes}</p>
        ) : (
          <p className="italic text-gray-500">
            No customer notes.
          </p>
        )}
      </div>
    </div>

    {/* Organization Notes */}
    <div className="mt-5">
      <p className="font-semibold text-gray-900">
        Organization Notes
      </p>

      <div className="mt-2 rounded-lg border bg-yellow-50 p-4">
        {booking.organizationNotes?.trim() ? (
          <p>{booking.organizationNotes}</p>
        ) : (
          <p className="italic text-gray-500">
            No organization notes.
          </p>
        )}
      </div>
    </div>

    {/* Button */}
    <div className="mt-8">
      <Link
        href={`/worker/bookings/${booking.id}`}
        className="inline-block rounded-lg bg-orange-400 px-6 py-3 font-medium text-white transition hover:bg-orange-500"
      >
        View Booking
      </Link>
    </div>
  </div>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}