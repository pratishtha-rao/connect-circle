import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import { notFound } from "next/navigation";
import OrganizationSettingsForm from "./settings-form";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();

  if (!profile) notFound();

  const organization = await prisma.organization.findFirst({
    where: {
      ownerId: profile.id,
    },
  });

  if (!organization) notFound();

  return (
    <main className="mx-auto max-w-3xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Organization Settings
      </h1>

      <OrganizationSettingsForm
        organization={organization}
      />

    </main>
  );
}
