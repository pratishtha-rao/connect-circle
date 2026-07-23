import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    console.log("prisma.organization:", prisma.organization);
    console.log("prisma.workerInvite:", prisma.workerInvite);
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

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    if (!body.fullName || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const existingInvite = await prisma.workerInvite.findFirst({
      where: {
        organizationId: organization.id,
        email: body.email,
        accepted: false,
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "An invitation has already been sent to this email." },
        { status: 400 }
      );
    }

    const token = crypto.randomUUID();

    const invite = await prisma.workerInvite.create({
      data: {
        fullName: body.fullName,
        email: body.email.toLowerCase(),
        organizationId: organization.id,
        token,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        ),
      },
    });

    // Temporary: log the invite link until email sending is added.
    console.log("==================================");
    console.log("Worker Invite Created");
    console.log(
      `http://localhost:3000/invite/${invite.token}`
    );
    console.log("==================================");

    return NextResponse.json({
      success: true,
      invite,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create invitation",
      },
      {
        status: 500,
      }
    );
  }
}
