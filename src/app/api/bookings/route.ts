import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const {
    serviceId,
    workerId,
    date,
    notes,
  } = body;

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      organization: true,
    },
  });

  if (!service || service.archived) {
    return NextResponse.json(
      { error: "Service not found." },
      { status: 404 }
    );
  }

  const bookingDate = new Date(date);

  //
  // Cannot book in the past
  //
  if (bookingDate.getTime() < Date.now()) {
    return NextResponse.json(
      {
        error: "You cannot book an appointment in the past.",
      },
      { status: 400 }
    );
  }

  //
  // Worker required?
  //
  if (
    service.organization?.allowWorkerSelection &&
    !workerId
  ) {
    return NextResponse.json(
      {
        error: "Please choose a worker.",
      },
      { status: 400 }
    );
  }

const workerService = await prisma.workerService.findFirst({
  where: {
    serviceId,
    workerId,
  },
});

if (
  workerId &&
  service.organization?.allowWorkerSelection &&
  !workerService
) {
  return NextResponse.json(
    {
      error: "Invalid worker selected.",
    },
    { status: 400 }
  );
}

  //
  // Calculate appointment end
  //
  const bookingEnd = new Date(
    bookingDate.getTime() +
      service.duration * 60000
  );

  //
  // Prevent double booking
  //
  if (workerId) {
const existingBookings =
  await prisma.booking.findMany({
    where: {
      workerId,
      status: {
        in: [
          "PENDING",
          "PENDING_PAYMENT",
          "PENDING_APPROVAL",
          "CONFIRMED",
        ],
      },
    },
  });

for (const existing of existingBookings) {
  const existingStart = existing.date;

  const existingEnd = new Date(
    existingStart.getTime() +
      existing.serviceDurationSnapshot * 60000
  );

  const overlaps =
    bookingDate < existingEnd &&
    bookingEnd > existingStart;

  if (overlaps) {
    return NextResponse.json(
      {
        error:
          "That worker already has a booking during this time.",
      },
      { status: 400 }
    );
  }
}
}
  //
  // Worker availability
  //
  if (
    workerId &&
    service.organization?.allowWorkerSelection
  ) {
const availability =
  await prisma.availability.findMany({
    where: {
      workerId,
    },
  });
    const weekday = bookingDate.getDay();

    const dayAvailability =
      availability.find(
        (a) => a.dayOfWeek === weekday
      );

    if (!dayAvailability) {
      return NextResponse.json(
        {
          error:
            "That worker is unavailable on this day.",
        },
        { status: 400 }
      );
    }

const bookingStart = bookingDate
  .toTimeString()
  .slice(0, 5);

const bookingFinish = bookingEnd
  .toTimeString()
  .slice(0, 5);

    if (
      bookingStart < dayAvailability.startTime ||
      bookingFinish > dayAvailability.endTime
    ) {
      return NextResponse.json(
        {
          error:
            "That time is outside the worker's availability.",
        },
        { status: 400 }
      );
    }
  }

  //
  // Organization availability
  //
  if (
    !service.organization?.allowWorkerSelection &&
    service.organization
  ) {
    const weekday = bookingDate.getDay();

    if (
      !service.organization.availabilityDays.includes(
        weekday
      )
    ) {
      return NextResponse.json(
        {
          error:
            "The organization is closed on this day.",
        },
        { status: 400 }
      );
    }

    const bookingTime = bookingDate
      .toTimeString()
      .slice(0, 5);

    if (
      service.organization.availabilityStartTime &&
      bookingTime <
        service.organization
          .availabilityStartTime
    ) {
      return NextResponse.json(
        {
          error:
            "The organization is not open yet.",
        },
        { status: 400 }
      );
    }

    if (
      service.organization.availabilityEndTime &&
      bookingTime >=
        service.organization
          .availabilityEndTime
    ) {
      return NextResponse.json(
        {
          error:
            "The organization is closed at that time.",
        },
        { status: 400 }
      );
    }
  }

  const booking =
    await prisma.booking.create({
      data: {
        profileId: profile.id,

        serviceId: service.id,

        workerId: workerId || null,

        date: bookingDate,

        notes,

        status: "PENDING",

        serviceTitleSnapshot:
          service.title,

        servicePriceSnapshot:
          service.price,

        serviceDurationSnapshot:
          service.duration,
      },
    });

  return NextResponse.json({
    booking,
  });
} 
