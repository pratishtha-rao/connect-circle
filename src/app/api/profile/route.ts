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

    const profile = await prisma.profile.upsert({
      where: {
        authId: body.authId,
      },
      update: {
        fullName: body.fullName,
        role,
      },
      create: {
        authId: body.authId,
        email: body.email,
        fullName: body.fullName,
        role,
        onboardingComplete: false,
      },
    });

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
        error: "Failed to create profile",
      },
      {
        status: 500,
      }
    );
  }
}