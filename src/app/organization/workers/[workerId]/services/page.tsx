import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import ServiceForm from "./service-form";

type Props = {
  params: Promise<{
    workerId: string;
  }>;
};

export default async function WorkerServicesPage({
  params,
}: Props) {
console.log(await params);
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
      services: true,
    },
  });

  if (!worker) {
    notFound();
  }

  const services = await prisma.service.findMany({
    where: {
      organizationId: organization.id,
    },
    orderBy: {
      title: "asc",
    },
  });

  const selectedServiceIds = worker.services.map(
    (service) => service.serviceId
  );

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-2 text-4xl font-bold">
        Assign Services
      </h1>

      <p className="mb-8 text-gray-600">
        {worker.profile.fullName}
      </p>

      <ServiceForm
        workerId={worker.id}
        services={services}
        selectedServiceIds={selectedServiceIds}
      />
    </main>
  );
}