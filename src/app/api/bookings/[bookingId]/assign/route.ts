import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Props
) {
  const { bookingId } = await params;

  const body = await request.json();

  //
  // Get the booking we're assigning
  //
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

  //
  // If removing worker, allow immediately
  //
  if (!body.workerId) {
    const updated = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        workerId: null,
      },
    });

    return NextResponse.json(updated);
  }

  //
  // Calculate booking end
  //
  const bookingStart = booking.date;

const bookingEnd = new Date(
  bookingStart.getTime() +
    (booking.serviceDurationSnapshot ?? 0) * 60000
);

  //
  // Get all bookings for this worker
  //
  const existingBookings =
    await prisma.booking.findMany({
      where: {
        workerId: body.workerId,
        status: {
          in: [
            "PENDING",
            "PENDING_PAYMENT",
            "PENDING_APPROVAL",
            "CONFIRMED",
          ],
        },
      },
    });

  //
  // Check overlaps
  //
  for (const existing of existingBookings) {

    // Ignore this booking itself
    if (existing.id === booking.id) continue;

    const existingStart = existing.date;

const existingEnd = new Date(
  existingStart.getTime() +
    (existing.serviceDurationSnapshot ?? 0) *
      60000
);

    const overlaps =
      bookingStart < existingEnd &&
      bookingEnd > existingStart;

    if (overlaps) {
      return NextResponse.json(
        {
          error:
            "That worker already has another booking during this time.",
        },
        {
          status: 400,
        }
      );
    }
  }

  //
  // Safe to assign
  //
  const updated =
    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        workerId: body.workerId,
      },
    });

  return NextResponse.json(updated);
}
