"use client";

import { useState } from "react";

export default function OrganizationSettingsForm({
  organization,
}: any) {
  const [name, setName] = useState(organization.name);
  const [description, setDescription] = useState(
    organization.description ?? ""
  );
  const [phone, setPhone] = useState(
    organization.phone ?? ""
  );
  const [address, setAddress] = useState(
    organization.address ?? ""
  );
  const [website, setWebsite] = useState(
    organization.website ?? ""
  );

  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);

    const res = await fetch("/api/organization/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        phone,
        address,
        website,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Unable to save.");
      return;
    }

    alert("Settings updated.");
  }

  return (
    <div className="space-y-5 rounded-xl border bg-white p-8 shadow-sm">

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Organization Name"
        className="w-full rounded-lg border p-3"
      />

      <textarea
        rows={4}
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        placeholder="Description"
        className="w-full rounded-lg border p-3"
      />

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
        className="w-full rounded-lg border p-3"
      />

      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
        className="w-full rounded-lg border p-3"
      />

      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        placeholder="Website"
        className="w-full rounded-lg border p-3"
      />

      <button
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}