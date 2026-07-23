import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import AvailabilityForm from "./availability-form";

export default async function AvailabilityPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const worker = await prisma.worker.findUnique({
    where: {
      profileId: profile.id,
    },
    include: {
      availability: true,
    },
  });

  if (!worker) {
    return <p>Worker not found.</p>;
  }

  return (
    <main className="mx-auto max-w-3xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Weekly Availability
      </h1>

      <AvailabilityForm
        existing={worker.availability}
      />

    </main>
  );
}