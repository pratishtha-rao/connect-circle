import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import RestoreServiceButton from "./restore-service-button";
import OrganizationNavbar from "@/components/organization-navbar";

export default async function ServicesPage() {
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

  const services = await prisma.service.findMany({
    where: {
      organizationId: organization.id,
      archived: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-5xl p-8">
            <OrganizationNavbar />
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Archived Services
        </h1>

<div>
  <Link
    href="/organization/services"
    className="inline-flex items-center rounded-xl bg-orange-500 px-5 py-3 font-timesnewroman text-white hover:bg-orange-600"
  >
    ← Active Services
  </Link>
</div>

      </div>

      {services.length === 0 ? (
        <p className="text-black">
          No archived services yet.
        </p>
      ) : (
<div className="mt-8 space-y-4">
              {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-blue-200 bg-blue-100 p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {service.title}
              </h2>

{service.description && (
  <p className="mt-3 text-black">
    <strong>Description:</strong>{" "}
    {service.description}
  </p>
)}

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-black">
                <span>
                  <strong>Category:</strong>{" "}
                  {service.category?.name ?? "None"}
                </span>

                <span>
                  <strong>Price:</strong> ${service.price}
                </span>

                <span>
                  <strong>Duration:</strong>{" "}
                  {service.duration} min
                </span>
              </div>

<div className="mt-6 flex gap-3">
  <RestoreServiceButton id={service.id} />
</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
