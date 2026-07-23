import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export async function POST(req: Request) {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const worker = await prisma.worker.findUnique({
      where: {
        profileId: profile.id,
      },
    });

    if (!worker) {
      return NextResponse.json(
        {
          error: "Worker not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body = await req.json();

    if (!body.fullName?.trim()) {
      return NextResponse.json(
        {
          error: "Full name is required.",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        fullName: body.fullName.trim(),
        phone: body.phone?.trim() || null,
      },
    });

    await prisma.worker.update({
      where: {
        id: worker.id,
      },
      data: {
        bio: body.bio?.trim() || null,
        languages: body.languages?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Worker Profile Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update profile.",
      },
      {
        status: 500,
      }
    );
  }
}