import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import ServiceForm from "../service-form";

export default async function NewServicePage() {
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

  const categories = await prisma.serviceCategory.findMany({
    where: {
      organizationId: organization.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-4xl font-bold">
        New Service
      </h1>

      <ServiceForm categories={categories} />
    </main>
  );
}