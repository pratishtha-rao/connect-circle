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
    return new NextResponse("Booking not found.", {
      status: 404,
    });
  }

  if (
    booking.status !== "COMPLETED" &&
    booking.status !== "CANCELLED"
  ) {
    return new NextResponse(
      "Only completed or cancelled bookings can be archived.",
      {
        status: 400,
      }
    );
  }

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      workerArchivedAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
  });
}