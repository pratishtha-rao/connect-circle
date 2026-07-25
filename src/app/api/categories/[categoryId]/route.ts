import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

type Props = {
  params: Promise<{
    categoryId: string;
  }>;
};

export async function DELETE(
  req: Request,
  { params }: Props
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

    const { categoryId } = await params;

    const category = await prisma.serviceCategory.findFirst({
      where: {
        id: categoryId,
        organizationId: organization.id,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    await prisma.service.updateMany({
      where: {
        categoryId,
      },
      data: {
        categoryId: null,
      },
    });

    await prisma.serviceCategory.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete category.",
      },
      {
        status: 500,
      }
    );
  }
}
