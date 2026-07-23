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

  const body = await request.json();

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      workerId: body.workerId || null,
    },
  });

  return NextResponse.json({
    success: true,
  });
}