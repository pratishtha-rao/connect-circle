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

  await prisma.profile.update({
    where: {
      id: profile.id,
    },
    data: {
      fullName: body.fullName,
      phone: body.phone,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
