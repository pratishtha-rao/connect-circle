import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

type Props = {
  params: Promise<{
    workerId: string;
  }>;
};

export async function DELETE(
  req: Request,
  { params }: Props
) {
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

  const { workerId } = await params;

  await prisma.organizationWorker.deleteMany({
    where: {
      organizationId: organization.id,
      workerId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}