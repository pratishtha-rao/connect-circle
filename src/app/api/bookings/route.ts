import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import { NextResponse } from "next/server";
import { BookingStatus } from "@prisma/client";

const ACTIVE_STATUSES: BookingStatus[] = [
  "PENDING",
  "PENDING_PAYMENT",
  "PENDING_APPROVAL",
  "CONFIRMED",
];

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

const dayStart = new Date(bookingDate);
dayStart.setHours(0, 0, 0, 0);

const dayEnd = new Date(dayStart);
dayEnd.setDate(dayEnd.getDate() + 1);

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
      error: "Invalid employee selected.",
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

  const weekday = bookingDate.getDay();

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
    (existing.serviceDurationSnapshot ?? service.duration) * 60000
);

  const overlaps =
    bookingDate < existingEnd &&
    bookingEnd > existingStart;

  if (overlaps) {
    return NextResponse.json(
      {
        error:
          "No employees are available during this time.",
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
            "That employee is unavailable on this day.",
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
            "That time is outside the employee's availability.",
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

  //
// Workers assigned to this service
//
const assignedWorkers = await prisma.organizationWorker.findMany({
  where: {
    organizationId: service.organization!.id,
    verified: true,
    worker: {
      services: {
        some: {
          serviceId,
        },
      },
      availability: {
        some: {
          dayOfWeek: weekday,
        },
      },
    },
  },
  include: {
    worker: {
      include: {
        availability: true,
      },
    },
  },
});

if (assignedWorkers.length === 0) {
  return NextResponse.json(
    {
      error: "No employees are assigned to this service.",
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

//
// Only workers actually working today
//
const workingWorkers = assignedWorkers.filter((worker) => {
  const availability =
    worker.worker.availability.find(
      (a) => a.dayOfWeek === weekday
    );

  if (!availability) return false;

  return (
    bookingStart >= availability.startTime &&
    bookingFinish <= availability.endTime
  );
});

if (workingWorkers.length === 0) {
  return NextResponse.json(
    {
      error:
        "No employees are available during that time.",
    },
    { status: 400 }
  );
}

const workerIds = workingWorkers.map(
  (w) => w.workerId
);

//
// Existing bookings
//
const activeBookings = await prisma.booking.findMany({
where: {
  workerId: {
    in: workerIds,
  },
  status: {
    in: ACTIVE_STATUSES,
  },
  date: {
    gte: dayStart,
    lt: dayEnd,
  },
}   

});

const busyWorkers = new Set<string>();

for (const booking of activeBookings) {
  if (!booking.workerId) continue;

  const existingStart = booking.date;

  const existingEnd = new Date(
    existingStart.getTime() +
      (booking.serviceDurationSnapshot ?? service.duration) *
        60000
  );

  const overlaps =
    bookingDate < existingEnd &&
    bookingEnd > existingStart;

  if (overlaps) {
    busyWorkers.add(booking.workerId);
  }
}

const availableWorkers = workerIds.filter(
  (id) => !busyWorkers.has(id)
);

let assignedWorker: string;

if (workerId) {
  if (!availableWorkers.includes(workerId)) {
    return NextResponse.json(
      {
        error: "That employee is no longer available."
      },
      { status: 400 }
    );
  }

  assignedWorker = workerId;
} else {
  if (availableWorkers.length === 0) {
    return NextResponse.json(
      {
        error: "No employees are available at that appointment time."
      },
      { status: 400 }
    );
  }

  assignedWorker = availableWorkers[0];
}


  const booking =
    await prisma.booking.create({
      data: {
        profileId: profile.id,

        serviceId: service.id,

            workerId: assignedWorker,

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

