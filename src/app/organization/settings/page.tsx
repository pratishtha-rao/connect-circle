import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import { notFound } from "next/navigation";
import OrganizationSettingsForm from "./settings-form";
import OrganizationNavbar from "@/components/organization-navbar";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();

  if (!profile) notFound();

const organization = await prisma.organization.findFirst({
  where: {
    ownerId: profile.id,
  },
  include: {
    owner: true,
  },
});  

  if (!organization) notFound();

return (
  <>       <OrganizationNavbar />

  <main className="mx-auto max-w-5xl p-8">

    <div className="mb-10">

      <h1 className="text-4xl font-bold text-gray-900">
        Organization Settings
      </h1>

      <p className="mt-2 text-gray-600">
        Manage your organization information and account settings.
      </p>

    </div>

    <OrganizationSettingsForm
      organization={organization}
    />

  </main>
  </>
);
}