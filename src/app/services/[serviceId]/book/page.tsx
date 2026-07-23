import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingForm from "./booking-form";

type Props = {
  params: Promise<{
    serviceId: string;
  }>;
};

export default async function BookServicePage({
  params,
}: Props) {
  const { serviceId } = await params;

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-4xl font-bold">
        Book {service.title}
      </h1>

      <p className="mt-2 mb-8 text-gray-600">
        Choose a date and add optional notes.
      </p>

      <BookingForm serviceId={service.id} />
    </main>
  );
}
