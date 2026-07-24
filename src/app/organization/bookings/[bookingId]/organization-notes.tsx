"use client";

import { useState } from "react";

type Props = {
  bookingId: string;
  currentNotes: string;
};

export default function OrganizationNotes({
  bookingId,
  currentNotes,
}: Props) {
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);

  async function saveNotes() {
    setSaving(true);

    const res = await fetch(
      `/api/bookings/${bookingId}/organization-notes`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes,
        }),
      }
    );

    setSaving(false);

    if (!res.ok) {
      alert("Unable to save notes.");
      return;
    }

    alert("Notes saved.");

    window.location.reload();
  }

  return (
    <div className="rounded-xl border bg-gray-50 p-6">

      <h2 className="text-xl font-semibold">
        Organization Notes
      </h2>

      <p className="mt-2 text-gray-600">
        These notes are visible to the customer.
      </p>

      <textarea
        rows={6}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="mt-4 w-full rounded-lg border p-3"
        placeholder="Write a message to the customer..."
      />

      <button
        onClick={saveNotes}
        disabled={saving}
        className="mt-5 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Notes"}
      </button>


    </div>
  );
}