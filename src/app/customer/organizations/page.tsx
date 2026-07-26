import { prisma } from "@/lib/prisma";
import OrganizationSearch from "./organization-search";
import CustomerNavbar from "@/components/customer-navbar";

export default async function CustomerOrganizationsPage() {
const organizations = await prisma.organization.findMany({
  orderBy: {
    name: "asc",
  },
  select: {
    id: true,
    name: true,
    description: true,
    logo: true,
    address: true,
    phone: true,
    website: true,
    timezone: true,
    tags: true,
  },
});

  return (
    <main className="mx-auto max-w-7xl p-8">
            <CustomerNavbar />
      <h1 className="text-4xl font-bold">
        Browse Organizations
      </h1>

      <p className="mt-2 mb-8 text-gray-600">
        Search organizations by name or category.
      </p>

      <OrganizationSearch organizations={organizations} />
    </main>
  );
}

