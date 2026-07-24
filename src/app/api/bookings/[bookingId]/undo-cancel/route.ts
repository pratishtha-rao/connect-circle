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

  if (!booking.cancellationReason) {
    return NextResponse.json(
      { error: "This booking was not cancelled by the organization." },
      { status: 400 }
    );
  }

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: booking.previousStatus ?? "PENDING",

      previousStatus: null,

      cancellationReason: null,
      cancelledAt: null,
    },
  });

  return NextResponse.json({
    success: true,
  });
}