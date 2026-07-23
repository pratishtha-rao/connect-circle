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

    const organization = await prisma.organization.findFirst({
      where: {
        ownerId: profile.id,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const service = await prisma.service.create({
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        duration: Number(body.duration),
        categoryId: body.categoryId || null,
        organizationId: organization.id,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}