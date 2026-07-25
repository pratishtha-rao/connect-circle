import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const updated = await prisma.organization.update({
      where: {
        ownerId: profile.id,
      },
      data: {
        name: body.name,
        description: body.description,
        phone: body.phone,
        address: body.address,
        website: body.website,
        logo: body.logo,
        timezone: body.timezone,

        bookingNotes: body.bookingNotes,
        paymentInstructions: body.paymentInstructions,

        tags: body.tags ?? [],
        allowWorkerSelection: body.allowWorkerSelection ?? true,

        availabilityStartTime: body.availabilityStartTime,
        availabilityEndTime: body.availabilityEndTime,
        availabilityDays: body.availabilityDays ?? [],
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}