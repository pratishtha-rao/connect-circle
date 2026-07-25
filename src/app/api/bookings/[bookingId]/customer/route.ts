import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

type RouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function PATCH(
  req: Request,
  { params }: RouteContext
) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { bookingId } = await params;

  const body = await req.json();

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      profileId: profile.id,
    },
  });

  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found." },
      { status: 404 }
    );
  }

  await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      notes: body.notes,
    },
  });

  return NextResponse.json({
    success: true,
  });
}

export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { bookingId } = await params;

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      profileId: profile.id,
    },
  });

  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found." },
      { status: 404 }
    );
  }

  if (
    booking.status !== "PENDING" &&
    booking.status !== "CONFIRMED"
  ) {
    return NextResponse.json(
      {
        error:
          "This booking can no longer be cancelled.",
      },
      { status: 400 }
    );
  }

  await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      previousStatus: booking.status,

      status: "CANCELLED",

      customerCancelledAt: new Date(),

      customerCancellationReason:
        "Cancelled by customer",
    },
  });

  return NextResponse.json({
    success: true,
  });
}
