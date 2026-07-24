import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import WorkerCancelBooking from "./worker-cancel-booking";
import WorkerArchiveBooking from "../worker-archive-booking";

type Props = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function WorkerBookingPage({
  params,
}: Props) {
  const { bookingId } = await params;

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

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      workerId: worker.id,
    },
    include: {
      profile: true,
      service: true,
      payment: true,
    },
  });

  if (!booking) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-8">

      <div className="mb-8 flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          Booking Details
        </h1>

        <Link
          href="/worker/bookings"
          className="rounded-lg border px-5 py-3 hover:bg-gray-50"
        >
          Back
        </Link>

      </div>

      <div className="space-y-6 rounded-xl border bg-white p-8 shadow-sm">

        <div>
          <strong>Customer</strong>
          <p>{booking.profile.fullName}</p>
        </div>

        <div>
          <strong>Service</strong>
          <p>{booking.service.title}</p>
        </div>

        <div>
          <strong>Date</strong>
          <p>{booking.date.toLocaleString()}</p>
        </div>

        <div>

          <strong>Status</strong>

          <div className="mt-3">

            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold
              ${
                booking.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : booking.status === "PENDING_PAYMENT"
                  ? "bg-orange-100 text-orange-700"
                  : booking.status === "CONFIRMED"
                  ? "bg-blue-100 text-blue-700"
                  : booking.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {booking.status.replaceAll("_", " ")}
            </span>

          </div>

        </div>

        <div>
          <strong>Payment</strong>
          <p>{booking.payment?.status ?? "No payment"}</p>
        </div>

        <hr />

        <div>

          <h2 className="text-xl font-semibold">
            Organization Notes
          </h2>

          <div className="mt-3 rounded-lg border bg-orange-50 p-4">

            {booking.organizationNotes ? (
              <p>{booking.organizationNotes}</p>
            ) : (
              <p className="text-gray-500">
                No notes from the organization.
              </p>
            )}

          </div>

        </div>

        <div>

          <h2 className="text-xl font-semibold">
            Customer Notes
          </h2>

          <div className="mt-3 rounded-lg border bg-gray-50 p-4">

            {booking.notes ? (
              <p>{booking.notes}</p>
            ) : (
              <p className="text-gray-500">
                No customer notes.
              </p>
            )}

          </div>

        </div>

        {booking.cancellationReason && (

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">

            <h2 className="text-lg font-semibold text-red-700">
              Cancelled by Organization
            </h2>

            <p className="mt-2">
              {booking.cancellationReason}
            </p>

          </div>

        )}

        {booking.workerCancellationReason && (

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">

            <h2 className="text-lg font-semibold text-orange-700">
              Cancelled by You
            </h2>

            <p className="mt-2">
              {booking.workerCancellationReason}
            </p>

          </div>

        )}

        <hr />

        {booking.status !== "CANCELLED" && (

<WorkerCancelBooking
  bookingId={booking.id}
  status={booking.status}
  workerCancelled={!!booking.workerCancelledAt}
  organizationCancelled={!!booking.cancelledAt}
/>      
  )}

{(booking.status === "COMPLETED" ||
  booking.status === "CANCELLED") &&
 !booking.workerArchivedAt && (
  <div className="mt-5">
    <WorkerArchiveBooking
      bookingId={booking.id}
    />
  </div>
)}

      </div>

    </main>
  );
}
