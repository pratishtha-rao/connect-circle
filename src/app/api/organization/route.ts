import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export async function POST(req: Request) {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const existing = await prisma.organization.findUnique({
      where: {
        ownerId: profile.id,
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const organization = await prisma.organization.create({
      data: {
        ownerId: profile.id,
        name: body.name,
        description: body.description,
        address: body.address,
        phone: body.phone,
        website: body.website,
        timezone: body.timezone,
      },
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create organization",
      },
      {
        status: 500,
      }
    );
  }
}