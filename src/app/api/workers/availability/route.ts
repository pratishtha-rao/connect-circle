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

    const worker = await prisma.worker.findUnique({
      where: {
        profileId: profile.id,
      },
    });

    if (!worker) {
      return NextResponse.json(
        { error: "Worker not found." },
        { status: 404 }
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
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to save availability.",
      },
      {
        status: 500,
      }
    );
  }
}