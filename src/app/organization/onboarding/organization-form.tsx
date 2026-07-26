"use client";

import dynamic from "next/dynamic";
import type { ITimezoneOption } from "react-timezone-select";
import { useState } from "react";

export default function OrganizationForm() {
  const [loading, setLoading] = useState(false);

  const TimezoneSelect = dynamic(
  () => import("react-timezone-select"),
  { ssr: false }
);

const detectedTimezone =
  Intl.DateTimeFormat().resolvedOptions().timeZone;

const [timezone, setTimezone] =
  useState<ITimezoneOption>({
    value: detectedTimezone,
    label: detectedTimezone,
  });

  async function onSubmit(formData: FormData) {
    setLoading(true);

    const res = await fetch("/api/organization", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description"),
        phone: formData.get("phone"),
        website: formData.get("website"),
        address: formData.get("address"),
        timezone: timezone.value,
      }),
    });
    
if (!res.ok) {
  const data = await res.json();

  alert(data.error ?? "Failed to create organization.");

  setLoading(false);
  return;
}

    window.location.href = "/organization";
  }

  return (
    <form action={onSubmit} className="space-y-5">

      <input
        name="name"
        placeholder="Organization Name"
        required
        className="w-full rounded-xl border p-3"
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full rounded-xl border p-3"
      />

      <input
        name="phone"
        placeholder="Phone"
        className="w-full rounded-xl border p-3"
      />

      <input
        name="website"
        placeholder="Website"
        className="w-full rounded-xl border p-3"
      />

      <input
        name="address"
        placeholder="Address"
        className="w-full rounded-xl border p-3"
      />

<div className="space-y-2">

  <label className="font-medium">
    Organization Time Zone
  </label>

  <TimezoneSelect
    value={timezone}
    onChange={setTimezone}
  />

  <p className="text-sm text-gray-500">
    All appointments will be stored using this time zone. Customers and workers
    will see booking times relative to the organization's selected time zone.
  </p>

</div>

      <button
        disabled={loading}
        className="w-full rounded-xl bg-orange-500 p-3 font-semibold text-white hover:bg-orange-600"
      >
        {loading ? "Creating..." : "Create Organization"}
      </button>

    </form>
  );
}