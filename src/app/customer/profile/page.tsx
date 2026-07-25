import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import ProfileForm from "./profile-form";

export default async function CustomerProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const customer = await prisma.profile.findUnique({
    where: {
      id: profile.id,
    },
  });

  if (!customer) {
    return <p>Customer not found.</p>;
  }

  return (
    <main className="mx-auto max-w-3xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Manage Profile
      </h1>

      <ProfileForm
        profile={customer}
      />

    </main>
  );
}