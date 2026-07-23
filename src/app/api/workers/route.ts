import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import { UserRole } from "@prisma/client";

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

    const workerProfile = await prisma.profile.create({
      data: {
        authId: crypto.randomUUID(),
        email: body.email,
        fullName: body.fullName,
        role: UserRole.WORKER,
      },
    });

    const worker = await prisma.worker.create({
      data: {
        profileId: workerProfile.id,
        bio: body.bio,
        languages: body.languages,
      },
    });

    await prisma.organizationWorker.create({
      data: {
        organizationId: organization.id,
        workerId: worker.id,
        verified: true,
        primaryOrg: true,
      },
    });

    return NextResponse.json(worker);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create worker",
      },
      {
        status: 500,
      }
    );
  }
}
