import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingForm from "./booking-form";

type Props = {
  params: Promise<{
    organizationId: string;
    serviceId: string;
  }>;
};

export default async function BookServicePage({
  params,
}: Props) {
  const { serviceId } = await params;

const service = await prisma.service.findFirst({
  where: {
    id: serviceId,
    archived: false,
  },
  include: {
    organization: true,
    workers: {
      include: {
        worker: {
          include: {
            profile: true,
            availability: true,
          },
        },
      },
    },
  },
});

  if (!service) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-8">

      <h1 className="text-4xl font-bold">
        Book {service.title}
      </h1>

<p className="mt-2 mb-8 text-gray-600">
  {service.organization?.allowWorkerSelection ?? true
    ? "Select your preferred worker, date and time."
    : "Select your preferred appointment date and time."}
</p>

<BookingForm
  serviceId={service.id}
  organizationId={service.organizationId ?? ""}
allowWorkerSelection={
  service.organization?.allowWorkerSelection ?? true
}  instructions={service.instructions}
  organizationNotes={service.organization?.bookingNotes ?? null}
  paymentInstructions={service.organization?.paymentInstructions ?? null}
  workers={service.workers.map((w) => ({
    id: w.worker.id,
    name: w.worker.profile.fullName,
    availability: w.worker.availability,
  }))}
/>
console.log(workers);

    </main>
  );
}
