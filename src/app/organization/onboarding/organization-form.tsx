"use client";

import { useState } from "react";

export default function OrganizationForm() {
  const [loading, setLoading] = useState(false);

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
        timezone: formData.get("timezone"),
      }),
    });

    if (!res.ok) {
      alert("Failed to create organization.");
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

      <input
        name="timezone"
        placeholder="Timezone"
        defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}
        className="w-full rounded-xl border p-3"
      />

      <button
        disabled={loading}
        className="w-full rounded-xl bg-orange-500 p-3 font-semibold text-white hover:bg-orange-600"
      >
        {loading ? "Creating..." : "Create Organization"}
      </button>

    </form>
  );
}