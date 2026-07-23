import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

type Props = {
  params: Promise<{
    workerId: string;
  }>;
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function WorkerAvailabilityPage({
  params,
}: Props) {
  const { workerId } = await params;

  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const organization = await prisma.organization.findFirst({
    where: {
      ownerId: profile.id,
    },
  });

  if (!organization) {
    return <p>Organization not found.</p>;
  }

  const worker = await prisma.worker.findUnique({
    where: {
      id: workerId,
    },
    include: {
      profile: true,
      availability: {
        orderBy: [
          {
            dayOfWeek: "asc",
          },
          {
            startTime: "asc",
          },
        ],
      },
    },
  });

  if (!worker) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-4xl font-bold">
        {worker.profile.fullName}
      </h1>

      <p className="mb-8 text-gray-600">
        Worker Availability
      </p>

      {worker.availability.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          No availability has been added yet.
        </div>
      ) : (
        <div className="space-y-4">
          {worker.availability.map((slot) => (
            <div
              key={slot.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <p className="font-semibold">
                {DAYS[slot.dayOfWeek]}
              </p>

              <p className="text-gray-600">
                {slot.startTime} – {slot.endTime}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
