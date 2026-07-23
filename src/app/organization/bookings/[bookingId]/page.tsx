import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingActions from "./booking-actions";

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

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-4xl font-bold">
        Booking Details
      </h1>

      <div className="space-y-5 rounded-xl border bg-white p-8 shadow-sm">

        <div>
          <strong>Customer</strong>
          <p>{booking.profile.fullName}</p>
        </div>

        <div>
          <strong>Service</strong>
          <p>{booking.service.title}</p>
        </div>

        <div>
          <strong>Assigned Worker</strong>
          <p>
            {booking.worker?.profile.fullName ??
              "Not Assigned"}
          </p>
        </div>

        <div>
          <strong>Date</strong>
          <p>{booking.date.toLocaleString()}</p>
        </div>

        <div>
          <strong>Status</strong>
          <p>{booking.status}</p>
        </div>

        <div>
          <strong>Notes</strong>
          <p>{booking.notes || "None"}</p>
        </div>

        <div>
          <strong>Payment</strong>
          <p>{booking.payment?.status ?? "No payment"}</p>
        </div>

        <hr />

        <div className="flex flex-wrap gap-3">

<BookingActions bookingId={booking.id} />

<BookingActions bookingId={booking.id} />

<BookingActions bookingId={booking.id} />

<BookingActions bookingId={booking.id} />

        </div>

      </div>
    </main>
  );
}