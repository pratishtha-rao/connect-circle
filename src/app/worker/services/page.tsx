import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export default async function WorkerServicesPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const worker = await prisma.worker.findUnique({
    where: {
      profileId: profile.id,
    },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
  });

  if (!worker) {
    return <p>Worker not found.</p>;
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-2 text-4xl font-bold">
        My Services
      </h1>

      <p className="mb-8 text-gray-600">
        These services have been assigned by your organization.
      </p>

      {worker.services.length === 0 ? (
        <div className="rounded-xl border p-6">
          No services have been assigned yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {worker.services.map((workerService) => (
            <div
              key={workerService.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {workerService.service.title}
              </h2>

              <p className="mt-2 text-gray-600">
                {workerService.service.description ||
                  "No description available."}
              </p>

              <p className="mt-4">
                <strong>Duration:</strong>{" "}
                {workerService.service.duration} minutes
              </p>

              <p>
                <strong>Price:</strong> $
                {workerService.service.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}