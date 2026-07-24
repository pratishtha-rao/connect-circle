import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function PATCH(
  req: Request,
  { params }: Props
) {
  const { bookingId } = await params;

  const body = await req.json();

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found." },
      { status: 404 }
    );
  }

  if (booking.status === "CANCELLED") {
    return NextResponse.json(
      { error: "Booking is already cancelled." },
      { status: 400 }
    );
  }

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      previousStatus: booking.status,

      status: "CANCELLED",

      workerCancellationReason: body.reason,

      workerCancelledAt: new Date(),

      cancellationReason: null,
      cancelledAt: null,
    },
  });

  return NextResponse.json({
    success: true,
  });
}