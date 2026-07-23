import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import ProfileForm from "./profile-form";

export default async function WorkerProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const worker = await prisma.worker.findUnique({
    where: {
      profileId: profile.id,
    },
  });

  if (!worker) {
    return <p>Worker not found.</p>;
  }

  return (
    <main className="mx-auto max-w-3xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Manage Profile
      </h1>

      <ProfileForm
        profile={profile}
        worker={worker}
      />

    </main>
  );
}