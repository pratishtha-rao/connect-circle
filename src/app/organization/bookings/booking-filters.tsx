"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Worker = {
  id: string;
  profile: {
    fullName: string;
  };
};

type Service = {
  id: string;
  title: string;
};

type Props = {
  workers: Worker[];
  services: Service[];
};

export default function BookingFilters({
  workers,
  services,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  function update(
    key: string,
    value: string
  ) {
    const search = new URLSearchParams(params);

    if (value) {
      search.set(key, value);
    } else {
      search.delete(key);
    }

    router.push(
      `/organization/bookings?${search.toString()}`
    );
  }

  return (
    <div className="mt-8 flex flex-wrap gap-4">

      <input
        placeholder="Search customer..."
        defaultValue={params.get("search") ?? ""}
        onChange={(e) =>
          update("search", e.target.value)
        }
        className="rounded-lg border p-2"
      />

      <select
        defaultValue={params.get("status") ?? ""}
        onChange={(e) =>
          update("status", e.target.value)
        }
        className="rounded-lg border p-2"
      >
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      <select
        defaultValue={params.get("worker") ?? ""}
        onChange={(e) =>
          update("worker", e.target.value)
        }
        className="rounded-lg border p-2"
      >
        <option value="">All Workers</option>

        {workers.map((worker) => (
          <option
            key={worker.id}
            value={worker.id}
          >
            {worker.profile.fullName}
          </option>
        ))}
      </select>

      <select
        defaultValue={params.get("service") ?? ""}
        onChange={(e) =>
          update("service", e.target.value)
        }
        className="rounded-lg border p-2"
      >
        <option value="">All Services</option>

        {services.map((service) => (
          <option
            key={service.id}
            value={service.id}
          >
            {service.title}
          </option>
        ))}
      </select>

    </div>
  );
}