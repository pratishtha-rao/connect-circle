import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export async function POST(req: Request) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const booking = await prisma.booking.create({
    data: {
      profileId: profile.id,
      serviceId: body.serviceId,
      date: new Date(body.date),
      notes: body.notes,
      status: "PENDING",
    },
  });

  return NextResponse.json(booking);
}