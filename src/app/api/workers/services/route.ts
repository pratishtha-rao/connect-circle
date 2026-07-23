import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

type Props = {
  params: Promise<{
    workerId: string;
  }>;
};

export async function POST(
  req: Request,
  { params }: Props
) {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return NextResponse.json(
        { error: "Unauthorized." },
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
        { error: "Organization not found." },
        { status: 404 }
      );
    }

    const { workerId } = await params;

    const body = await req.json();

    const serviceIds: string[] = body.serviceIds ?? [];

    const worker = await prisma.worker.findUnique({
      where: {
        id: workerId,
      },
    });

    if (!worker) {
      return NextResponse.json(
        { error: "Worker not found." },
        { status: 404 }
      );
    }

    // Remove current assignments
    await prisma.workerService.deleteMany({
      where: {
        workerId,
      },
    });

    // Add new assignments
    if (serviceIds.length > 0) {
      await prisma.workerService.createMany({
        data: serviceIds.map((serviceId) => ({
          workerId,
          serviceId,
        })),
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to update worker services.",
      },
      {
        status: 500,
      }
    );
  }
}
