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

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      workerArchivedAt: null,
    },
  });

  return NextResponse.json({
    success: true,
  });
}