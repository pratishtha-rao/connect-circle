import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    include: {
      organization: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-7xl p-8">
      <h1 className="text-4xl font-bold">
        Services
      </h1>

      <p className="mt-2 mb-8 text-gray-600">
        Browse available services.
      </p>

      {services.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          No services available.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold">
                {service.title}
              </h2>

              <p className="mt-2 text-gray-600">
                {service.description || "No description."}
              </p>

              <div className="mt-4 space-y-1">
                <p>
                  <strong>Price:</strong> ${service.price}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {service.duration} minutes
                </p>

                <p>
                  <strong>Organization:</strong>{" "}
                  {service.organization?.name ?? "Independent"}
                </p>
              </div>

              <Link
                href={`/services/${service.id}`}
                className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
              >
                View Service
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}