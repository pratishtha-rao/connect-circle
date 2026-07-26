import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceSearch from "./service-search";
import CustomerNavbar from "@/components/customer-navbar";

type Props = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function OrganizationServicesPage({
  params,
}: Props) {
  const { organizationId } = await params;

  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    include: {
  categories: {
    orderBy: {
      name: "asc",
    },
  },

services: {
  where: {
    archived: false,
  },

  include: {
    category: true,
  },

  orderBy: {
    title: "asc",
  },
},
},

  });

  if (!organization) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl p-8">
            <CustomerNavbar />

      <h1 className="text-4xl font-bold">
        {organization.name}
      </h1>

      <p className="mt-2 mb-8 text-gray-600">
        Browse available services.
      </p>

<ServiceSearch
  organizationId={organization.id}
  services={organization.services}
  categories={organization.categories}
/>
    </main>
  );
}