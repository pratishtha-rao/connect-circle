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

  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      organizationNotes: body.notes,
    },
  });

  return NextResponse.json({
    success: true,
  });
}