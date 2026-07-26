import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AssignWorker from "./assign-worker";
import BookingStatusButtons from "./booking-status-buttons";
import CancelBooking from "./cancel-booking";
import ArchiveBooking from "./archive-booking";
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
      payment: true,
      worker: {
        include: {
          profile: true,
        },
      },
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

        <div>
<div>
  <strong>Status</strong>

  {booking.status === "PENDING_PAYMENT" ? (
    <p>Payment Pending</p>
  ) : (
    <p>{booking.status}</p>
  )}
</div>        </div>

        <BookingStatusButtons
          bookingId={booking.id}
          currentStatus={booking.status}
          customerCancelledAt={booking.customerCancelledAt?.toISOString() ?? null}
        />

<div>
  <strong>Expected Payment</strong>

  <p>
    ${booking.service.price}
  </p>

  {booking.payment && (
    <p className="mt-1 text-sm text-gray-500">
      Payment Status: {booking.payment.status}
    </p>
  )}
</div>
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

        <OrganizationNotes
          bookingId={booking.id}
          currentNotes={booking.organizationNotes ?? ""}
        />

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
              Cancelled by Worker
            </h2>

            <p className="mt-2">
              {booking.workerCancellationReason}
            </p>

          </div>
        )}

        <hr />

        {booking.status !== "CANCELLED" && (
          <CancelBooking
            bookingId={booking.id}
          />
        )}

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