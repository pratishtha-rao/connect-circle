"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Service = {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  price: number;
};

export default function ServiceList({
  organizationId,
  services,
}: {
  organizationId: string;
  services: Service[];
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return services.filter((service) =>
      service.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, services]);

  return (
    <>
      <input
        placeholder="Search services..."
        className="mb-8 w-full rounded-xl border p-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-bold">
              {service.title}
            </h3>

            <p className="mt-3 text-gray-600">
              {service.description}
            </p>

            <div className="mt-5 space-y-1">
              <p>
                <strong>Price:</strong> ${service.price}
              </p>

              <p>
                <strong>Duration:</strong> {service.duration} min
              </p>
            </div>

            <Link
              href={`/customer/organizations/${organizationId}/services/${service.id}`}
              className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white"
            >
              View Service
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}