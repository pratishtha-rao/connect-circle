import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import OrganizationForm from "./organization-form";

export default async function OrganizationOnboardingPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  // Allow both organization admins and the super admin
  if (
    profile.role !== "ORG_ADMIN" &&
    profile.role !== "SUPER_ADMIN"
  ) {
    redirect("/dashboard");
  }

  const organization = await prisma.organization.findUnique({
    where: {
      ownerId: profile.id,
    },
  });

  if (organization) {
    redirect("/organization");
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-2 text-4xl font-bold">
        Create your organization
      </h1>

      <p className="mb-8 text-gray-600">
        Let's set up your organization before you start accepting bookings.
      </p>

      <OrganizationForm />
    </main>
  );
}