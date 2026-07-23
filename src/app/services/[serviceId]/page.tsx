import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    serviceId: string;
  }>;
};

export default async function ServicePage({
  params,
}: Props) {
  const { serviceId } = await params;

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      organization: true,
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold">
          {service.title}
        </h1>

        <p className="mt-4 text-gray-600">
          {service.description || "No description."}
        </p>

        <div className="mt-8 space-y-2">
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
          href={`/services/${service.id}/book`}
          className="mt-8 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Book Appointment
        </Link>
      </div>
    </main>
  );
}