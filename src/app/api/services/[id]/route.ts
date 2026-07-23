import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();

    const service = await prisma.service.update({
      where: {
        id,
      },
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        duration: Number(body.duration),
        categoryId: body.categoryId || null,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update service",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const service = await prisma.service.findFirst({
      where: {
        id,
        organizationId: organization.id,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete service",
      },
      {
        status: 500,
      }
    );
  }
}