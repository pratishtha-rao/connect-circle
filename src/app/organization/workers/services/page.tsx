import Link from "next/link";
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
        orderBy: {
          service: {
            title: "asc",
          },
        },
      },
    },
  });

  if (!worker) {
    return <p>Worker not found.</p>;
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          My Services
        </h1>

        <Link
          href="/worker"
          className="rounded-lg border px-4 py-2"
        >
          Back
        </Link>
      </div>

      {worker.services.length === 0 ? (
        <div className="rounded-xl border p-8">
          <p className="text-gray-500">
            Your organization hasn't assigned any services yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {worker.services.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-xl border p-6"
            >
              <h2 className="text-xl font-semibold">
                {assignment.service.title}
              </h2>

              {assignment.service.description && (
                <p className="mt-2 text-gray-600">
                  {assignment.service.description}
                </p>
              )}

              <div className="mt-4 text-sm text-gray-500">
                Assigned by your organization
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
