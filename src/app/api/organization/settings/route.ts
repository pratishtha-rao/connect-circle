import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  await prisma.organization.updateMany({
    where: {
      ownerId: profile.id,
    },
    data: {
      name: body.name,
      description: body.description,
      phone: body.phone,
      email: body.email,
      address: body.address,
      website: body.website,
    },
  });

  return NextResponse.json({
    success: true,
  });
}