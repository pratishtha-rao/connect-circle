import { notFound } from "next/navigation";
import CustomerNavbar from "@/components/customer-navbar";

import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

import BookingDetails from "./booking-details";

type Props = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function CustomerBookingPage({
  params,
}: Props) {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  const { bookingId } = await params;

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      profileId: profile.id,
    },
    include: {
      service: {
        include: {
          organization: true,
        },
      },

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
    <>
        <CustomerNavbar />
<main>
    <BookingDetails
      booking={{
        id: booking.id,

        status: booking.status,

        date: booking.date.toISOString(),

        notes: booking.notes ?? "",

        organizationNotes:
          booking.organizationNotes ?? "",

          customerCancellationReason:
  booking.customerCancellationReason ?? "",

  customerCancelledAt:
  booking.customerCancelledAt
    ? booking.customerCancelledAt.toISOString()
    : null,

      workerCancellationReason:
    booking.workerCancellationReason ?? "",

  workerCancelledAt:
    booking.workerCancelledAt
      ? booking.workerCancelledAt.toISOString()
      : null,

        cancellationReason:
          booking.cancellationReason ?? "",

        cancelledAt:
          booking.cancelledAt
            ? booking.cancelledAt.toISOString()
            : null,

        service: {
          id: booking.service.id,

          title: booking.service.title,

          description:
            booking.service.description ?? "",

          duration:
            booking.service.duration,

          price:
            booking.service.price,

          instructions:
            booking.service.instructions ?? "",
        },

        organization: {
          name:
            booking.service.organization?.name ??
            "",

             timezone:
    booking.service.organization?.timezone ?? null,


          bookingNotes:
            booking.service.organization
              ?.bookingNotes ?? "",

          paymentInstructions:
            booking.service.organization
              ?.paymentInstructions ?? "",
        },

        worker: booking.worker
          ? {
              id: booking.worker.id,

              name:
                booking.worker.profile
                  .fullName,
            }
          : null,

        payment: booking.payment
          ? {
              id: booking.payment.id,

              status:
                booking.payment.status,

              amount:
                booking.payment.amount,
            }
          : null,
      }}
    />
    </main>
    </>
  );
}