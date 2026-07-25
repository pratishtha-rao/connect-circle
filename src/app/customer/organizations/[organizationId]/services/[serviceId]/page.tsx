import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    organizationId: string;
    serviceId: string;
  }>;
};

export default async function CustomerServicePage({
  params,
}: Props) {
  const { organizationId, serviceId } = await params;

const service = await prisma.service.findFirst({
  where: {
    id: serviceId,
    organizationId,
    archived: false,
  },
      include: {
      organization: true,
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <h1 className="text-4xl font-bold">
          {service.title}
        </h1>

        <p className="mt-4 text-gray-600">
          {service.description || "No description available."}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">

          <div>
            <p className="font-semibold">
              Price
            </p>

            <p className="text-gray-600">
              ${service.price}
            </p>
          </div>

          <div>
            <p className="font-semibold">
              Duration
            </p>

            <p className="text-gray-600">
              {service.duration} minutes
            </p>
          </div>

          <div>
            <p className="font-semibold">
              Organization
            </p>

            <p className="text-gray-600">
              {service.organization?.name}
            </p>
          </div>

        </div>

        <div className="mt-10 rounded-xl border bg-orange-50 p-6">

          <h2 className="text-2xl font-bold">
            Instructions
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-gray-700">
            {service.instructions ||
              "No special instructions have been provided for this service."}
          </p>

        </div>

        <div className="mt-10 rounded-xl border bg-blue-50 p-6">

          <h2 className="text-2xl font-bold">
            Booking Information
          </h2>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              Choose your preferred worker (if the organization allows it).
            </li>

            <li>
              Select your preferred appointment date and time.
            </li>

            <li>
              Add any notes that may help the worker prepare.
            </li>

            <li>
              After submitting, your booking will appear in your Customer Dashboard.
            </li>

            <li>
              The organization may require payment before confirming your appointment.
            </li>

            <li>
              Your booking status will update in your dashboard once the organization reviews it.
            </li>
          </ul>

        </div>

        <Link
          href={`/customer/organizations/${organizationId}/services/${service.id}/book`}
          className="mt-10 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Book Appointment
        </Link>

      </div>
    </main>
  );
}