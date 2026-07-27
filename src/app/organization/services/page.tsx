import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import DeleteServiceButton from "./archive-service-button";
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
      archived: false,
    },
    include: {
      category: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return (
    <>             <OrganizationNavbar />

    <main className="mx-auto max-w-5xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Services
        </h1>
</div>

<div className="flex gap-3">

        <Link
          href="/organization/services/new"
          className="rounded-xl bg-orange-500 px-5 py-3 font-timesnewroman text-white hover:bg-orange-600"
        >
          New Service
        </Link>

  <Link
    href="/organization/services/archived"
    className="rounded-xl bg-gray-300 font-timesnewroman px-5 py-3 hover:bg-gray-400"
  >
    Archived
  </Link>

      </div>

<div className="mt-10"> </div>
      {services.length === 0 ? (
        <p className="text-gray-500">
          No services yet.
        </p>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border-blue-200 bg-blue-100 p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {service.title}
              </h2>

{service.archived && (
  <span className="mt-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
    Archived
  </span>
)}

              {service.description && (
                <p className="mt-2 text-gray-600">
                  {service.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-700">
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
  <Link
    href={`/organization/services/${service.id}/edit`}
    className="rounded-lg bg-orange-500 px-4 py-2 font-timesnewroman text-white hover:bg-orange-600"
  >
    Edit
  </Link>

{!service.archived && (
  <DeleteServiceButton id={service.id} />
)}
</div>
            </div>
          ))}
        </div>
      )}
    </main>
    </>
  );
}