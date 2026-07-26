import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export async function POST(req: Request) {
  try {
    const profile = await getCurrentProfile();

    console.log("====================================");
    console.log("PROFILE:", profile);

    if (!profile) {
      console.log("❌ No profile found.");

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
      console.log("❌ Worker not found.");

      return NextResponse.json(
        {
          error: "Employee not found.",
        },
        {
          status: 404,
        }
      );
    }

    const availability = await req.json();

    await prisma.availability.deleteMany({
      where: {
        workerId: worker.id,
      },
    });

    const rows = availability
      .filter((day: any) => day.enabled)
      .map((day: any) => ({
        workerId: worker.id,
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
      }));

    if (rows.length > 0) {
      await prisma.availability.createMany({
        data: rows,
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save availability.",
      },
      {
        status: 500,
      }
    );
  }
}