"use client";

import { useState } from "react";

type Service = {
  id: string;
  title: string;
};

type Props = {
  workerId: string;
  services: Service[];
  selectedServiceIds: string[];
};

export default function ServiceForm({
  workerId,
  services,
  selectedServiceIds,
}: Props) {
  const [selected, setSelected] = useState<string[]>(
    selectedServiceIds
  );

  const [saving, setSaving] = useState(false);

  function toggleService(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter((serviceId) => serviceId !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  async function saveServices() {
    setSaving(true);

    try {
      const res = await fetch(
        `/api/workers/${workerId}/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceIds: selected,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Failed to save services.");
        setSaving(false);
        return;
      }

      alert("Services updated successfully.");

      window.location.href = "/organization/workers";
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }

    setSaving(false);
  }

  return (
    <div className="space-y-6 rounded-xl border bg-white p-8 shadow-sm">
      <div className="space-y-3">
        {services.length === 0 ? (
          <p className="text-gray-500">
            No services have been created yet.
          </p>
        ) : (
          services.map((service) => (
            <label
              key={service.id}
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(service.id)}
                onChange={() => toggleService(service.id)}
              />

              <span>{service.title}</span>
            </label>
          ))
        )}
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={saveServices}
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Services"}
      </button>
    </div>
  );
}