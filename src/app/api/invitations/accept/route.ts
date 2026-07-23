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

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Invitation token is required." },
        { status: 400 }
      );
    }

    const invite = await prisma.workerInvite.findUnique({
      where: {
        token,
      },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Invitation not found." },
        { status: 404 }
      );
    }

    if (invite.accepted) {
      return NextResponse.json(
        { error: "Invitation has already been accepted." },
        { status: 400 }
      );
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired." },
        { status: 400 }
      );
    }

    // Ensure the logged-in user matches the invited email
    if (
      profile.email.toLowerCase() !==
      invite.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          error:
            "You must sign in with the invited email address.",
        },
        {
          status: 403,
        }
      );
    }

    // Find or create Worker
    let worker = await prisma.worker.findUnique({
      where: {
        profileId: profile.id,
      },
    });

    if (!worker) {
      worker = await prisma.worker.create({
        data: {
          profileId: profile.id,
        },
      });
    }

    // Link worker to organization (if not already linked)
    const existingMembership =
      await prisma.organizationWorker.findFirst({
        where: {
          organizationId: invite.organizationId,
          workerId: worker.id,
        },
      });

    if (!existingMembership) {
      await prisma.organizationWorker.create({
        data: {
          organizationId: invite.organizationId,
          workerId: worker.id,
          verified: true,
          primaryOrg: true,
        },
      });
    }

    // Mark invite accepted
    await prisma.workerInvite.update({
      where: {
        id: invite.id,
      },
      data: {
        accepted: true,
      },
    });

    // Promote profile to WORKER if needed
    if (profile.role !== "WORKER") {
      await prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          role: "WORKER",
        },
      });
    }

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
            : "Failed to accept invitation",
      },
      {
        status: 500,
      }
    );
  }
}