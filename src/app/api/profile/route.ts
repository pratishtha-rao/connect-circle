import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

const SUPER_ADMIN_EMAIL = "pratishtha.srao@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const role: UserRole =
      body.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
        ? UserRole.SUPER_ADMIN
        : body.role;

    // First try to find the profile by authId
    let profile = await prisma.profile.findUnique({
      where: {
        authId: body.authId,
      },
    });

    // If not found, try by email
    if (!profile) {
      profile = await prisma.profile.findUnique({
        where: {
          email: body.email,
        },
      });
    }

    if (profile) {
      profile = await prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          authId: body.authId,
          email: body.email,
          fullName: body.fullName,
          role,
        },
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          authId: body.authId,
          email: body.email,
          fullName: body.fullName,
          role,
          onboardingComplete: false,
        },
      });
    }

    if (
      role === UserRole.WORKER ||
      role === UserRole.INDEPENDENT_WORKER
    ) {
      await prisma.worker.upsert({
        where: {
          profileId: profile.id,
        },
        update: {},
        create: {
          profileId: profile.id,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create profile",
      },
      {
        status: 500,
      }
    );
  }
}