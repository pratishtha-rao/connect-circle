import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function PATCH(
  req: Request,
  { params }: Props
) {
  try {
    const { bookingId } = await params;
    const body = await req.json();

    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CANCELLED",
        cancellationReason: body.reason,
        cancelledAt: new Date(),
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}