import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingStatusButtons from "./booking-status-buttons";
import AssignWorker from "./assign-worker";
import ArchiveBooking from "./archive-booking";
import CancelBooking from "./cancel-booking";
import OrganizationNotes from "./organization-notes";

type Props = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function BookingPage({
  params,
}: Props) {
  const { bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      profile: true,
      service: true,
      worker: {
        include: {
          profile: true,
        },
      },
      payment: true,
    },
  });

  if (!booking) {
    notFound();
  }

  const workers = await prisma.worker.findMany({
    include: {
      profile: true,
      organizations: true,
    },
  });

  return (
    <main className="mx-auto max-w-4xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Booking Details
      </h1>

      <div className="space-y-6 rounded-xl border bg-white p-8 shadow-sm">

        <div>
          <strong>Customer</strong>
          <p>{booking.profile.fullName}</p>
        </div>

        <div>
          <strong>Service</strong>
          <p>{booking.service.title}</p>
        </div>

        <AssignWorker
          bookingId={booking.id}
          workers={workers}
          currentWorkerId={booking.workerId}
        />

        <div>
          <strong>Date</strong>
          <p>{booking.date.toLocaleString()}</p>
        </div>

        <BookingStatusButtons
          bookingId={booking.id}
          currentStatus={booking.status}
        />

        <div>
          <strong>Payment</strong>
          <p>{booking.payment?.status ?? "No payment"}</p>
        </div>

        <div>
          <strong>Customer Notes</strong>
          <p>{booking.notes || "None"}</p>
        </div>

<OrganizationNotes
  bookingId={booking.id}
  currentNotes={booking.organizationNotes ?? ""}
/>

{booking.status === "CANCELLED" &&
  booking.cancellationReason && (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
      <h2 className="text-lg font-semibold text-red-700">
        Cancellation Reason
      </h2>

      <p className="mt-2">
        {booking.cancellationReason}
      </p>
    </div>
)}
        <hr />

        <CancelBooking
          bookingId={booking.id}
        />

        {(booking.status === "COMPLETED" ||
          booking.status === "CANCELLED") && (
          <ArchiveBooking
            bookingId={booking.id}
          />
        )}

      </div>

    </main>
  );
}