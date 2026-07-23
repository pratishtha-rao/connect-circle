import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export async function GET() {
  console.log("GET /api/categories");

  try {
    const profile = await getCurrentProfile();
    console.log("Profile:", profile);

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

    console.log("Organization:", organization);

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const categories = await prisma.serviceCategory.findMany({
      where: {
        organizationId: organization.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log("Categories:", categories);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET ERROR:", error);

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

export async function POST(req: Request) {
  console.log("POST /api/categories");

  try {
    const profile = await getCurrentProfile();
    console.log("Profile:", profile);

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

    console.log("Organization:", organization);

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    console.log("Body:", body);

    const category = await prisma.serviceCategory.create({
      data: {
        name: body.name,
        organizationId: organization.id,
      },
    });

    console.log("Created:", category);

    return NextResponse.json(category);
  } catch (error) {
    console.error("POST ERROR:", error);

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