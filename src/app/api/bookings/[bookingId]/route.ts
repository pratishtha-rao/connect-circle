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

  const data: any = {
    status: body.status,
  };

  if (body.status === "CANCELLED") {
    data.cancellationReason = body.reason;
    data.cancelledAt = new Date();
  } else {
    data.cancellationReason = null;
    data.cancelledAt = null;
  }

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data,
  });

  return NextResponse.json({
    success: true,
  });
}
