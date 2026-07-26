import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import AvailabilityForm from "./availability-form";
import WorkerNavbar from "@/components/worker-navbar";

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
    return <p>Employee not found.</p>;
  }

  return (
<> 
      <WorkerNavbar/>

          <main className="mx-auto max-w-3xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Weekly Availability
      </h1>

<div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-center text-sm text-yellow-800">
  <strong>Note:</strong> All availability and business hours should be entered in your organization's time zone. You can find your organization's time zone on the Dashboard under the <strong>Organizations</strong> tab.
</div>

      <AvailabilityForm
        existing={worker.availability}
      />

    </main>
    </>
  );
}