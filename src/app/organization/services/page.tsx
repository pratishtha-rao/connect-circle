import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import DeleteServiceButton from "./delete-service-button";

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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Services
        </h1>

        <Link
          href="/organization/services/new"
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-gray-500">
          No services yet.
        </p>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {service.title}
              </h2>

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
    className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
  >
    ✏️ Edit
  </Link>

  <DeleteServiceButton id={service.id} />
</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}