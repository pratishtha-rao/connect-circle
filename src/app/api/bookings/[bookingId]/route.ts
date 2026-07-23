import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    bookingId: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  const { bookingId } = await params;

  const { status } = await request.json();

  const booking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status,
    },
  });

  return NextResponse.json(booking);
}