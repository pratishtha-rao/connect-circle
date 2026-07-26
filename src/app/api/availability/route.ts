import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

const ACTIVE_STATUSES: BookingStatus[] = [
  "PENDING",
  "PENDING_PAYMENT",
  "PENDING_APPROVAL",
  "CONFIRMED",
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const serviceId = searchParams.get("serviceId");
  const workerId = searchParams.get("workerId");
  const date = searchParams.get("date");

  if (!serviceId || !date) {
    return NextResponse.json(
      { error: "Missing parameters" },
      { status: 400 }
    );
  }

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      organization: true,
    },
  });

  if (!service) {
    return NextResponse.json(
      { error: "Service not found" },
      { status: 404 }
    );
  }

const day = new Date(`${date}T00:00:00`);

const dayStart = new Date(day);
dayStart.setHours(0, 0, 0, 0);

const dayEnd = new Date(dayStart);
dayEnd.setDate(dayEnd.getDate() + 1);

const weekday = day.getDay();

console.log({
  receivedDate: date,
  parsed: day.toString(),
  weekday,
});

  //
  // WORKER SELECTION MODE
  //

  if (
    service.organization?.allowWorkerSelection &&
    workerId
  ) {
    const availability =
      await prisma.availability.findFirst({
        where: {
          workerId,
          dayOfWeek: weekday,
        },
      });

      if (!availability) {
  return NextResponse.json({
    times: [],
  });
}
    const bookings =
      await prisma.booking.findMany({
where: {
  workerId,
  status: {
    in: ACTIVE_STATUSES,
  },
  date: {
    gte: dayStart,
    lt: dayEnd,
  },
},        select: {
          date: true,
          serviceDurationSnapshot: true,
        },
      });

    return NextResponse.json({
      times: buildAvailableSlots(
        day,
        availability.startTime,
        availability.endTime,
        service.duration,
        bookings
      ),
    });
  }

  //
  // ORGANIZATION MODE
  //

  const organization = service.organization;

  console.log({
  organizationDays: organization?.availabilityDays,
  organizationStart: organization?.availabilityStartTime,
  organizationEnd: organization?.availabilityEndTime,
});

  if (!organization) {
    return NextResponse.json({
      times: [],
    });
  }

  if (
    !organization.availabilityDays.includes(
      weekday
    )
  ) {
    return NextResponse.json({
      times: [],
    });
  }

  if (
    !organization.availabilityStartTime ||
    !organization.availabilityEndTime
  ) {
    return NextResponse.json({
      times: [],
    });
  }

const workers = await prisma.organizationWorker.findMany({
  where: {
    organizationId: organization.id,
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

console.log("Workers found:", workers.length);

if (workers.length > 0) {
  console.log(
    workers[0].worker.availability
  );
}

if (workers.length === 0) {
    return NextResponse.json({
      times: [],
    });
  }

  const workerIds = workers.map(
    (w) => w.workerId
  );

  const bookings =
    await prisma.booking.findMany({
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
},      select: {
        workerId: true,
        date: true,
        serviceDurationSnapshot: true,
      },
    });

const times: {
  time: string;
  workerId: string;
}[] = [];

  let [hour, minute] =
    organization.availabilityStartTime
      .split(":")
      .map(Number);

  const [endHour, endMinute] =
    organization.availabilityEndTime
      .split(":")
      .map(Number);

  while (
    hour < endHour ||
    (hour === endHour &&
      minute < endMinute)
  ) {
    const slotStart = new Date(day);
    slotStart.setHours(hour, minute, 0, 0);

    const slotEnd = new Date(
      slotStart.getTime() +
        service.duration * 60000
    );

    const closing = new Date(day);
closing.setHours(endHour, endMinute, 0, 0);

if (slotEnd > closing) {
  break;
}


let availableWorker: string | null = null;

for (const worker of workers) {
  const availability = worker.worker.availability.find(
    (a) => a.dayOfWeek === weekday
  );

  if (!availability) {
    continue;
  }

  const slotStartTime = slotStart
    .toTimeString()
    .slice(0, 5);

  const slotEndTime = slotEnd
    .toTimeString()
    .slice(0, 5);

  // Worker isn't working during this slot
  if (
    slotStartTime < availability.startTime ||
    slotEndTime > availability.endTime
  ) {
    continue;
  }

  // Worker is already booked
  const busy = bookings.some((b) => {
    if (b.workerId !== worker.workerId) return false;

const bookingEnd = new Date(
  b.date.getTime() +
    (b.serviceDurationSnapshot ?? service.duration) *
      60000
);

    return (
      slotStart < bookingEnd &&
      slotEnd > b.date
    );
  });

  if (!busy) {
    availableWorker = worker.workerId;
    break;
  }
}

if (availableWorker) {
  times.push({
    time: `${hour
      .toString()
      .padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`,
    workerId: availableWorker,
  });
}
    minute += 30;

    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }

const uniqueTimes = Array.from(
  new Map(times.map(slot => [slot.time, slot])).values()
);

return NextResponse.json({
  times: uniqueTimes,
});
}

function buildAvailableSlots(
  day: Date,
  start: string,
  end: string,
  duration: number,
  bookings: {
    date: Date;
  serviceDurationSnapshot: number | null;
  }[]
) {
const times: string[] = [];

  let [hour, minute] =
    start.split(":").map(Number);

  const [endHour, endMinute] =
    end.split(":").map(Number);

  while (
    hour < endHour ||
    (hour === endHour &&
      minute < endMinute)
  ) {
    const slotStart = new Date(day);
    slotStart.setHours(hour, minute, 0, 0);

    const slotEnd = new Date(
      slotStart.getTime() +
        duration * 60000
    );

    const closing = new Date(day);
closing.setHours(endHour, endMinute, 0, 0);

if (slotEnd > closing) {
  break;
}

const overlaps = bookings.some((booking) => {
  const bookingDuration =
    booking.serviceDurationSnapshot ?? duration;

  const bookingEnd = new Date(
    booking.date.getTime() +
      bookingDuration * 60000
  );

  return (
    slotStart < bookingEnd &&
    slotEnd > booking.date
  );
});

    if (!overlaps) {
      times.push(
        `${hour
          .toString()
          .padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      );
    }

    minute += 30;

    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }

  return times;
}


