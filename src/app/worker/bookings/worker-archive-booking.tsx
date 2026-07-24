"use client";

import { useState } from "react";

export default function WorkerArchiveBooking({
  bookingId,
}: {
  bookingId: string;
}) {
  const [saving, setSaving] = useState(false);

  async function archiveBooking() {
    if (!confirm("Archive this booking?")) {
      return;
    }

    setSaving(true);

    const res = await fetch(
      `/api/workers/bookings/${bookingId}/archive`,
      {
        method: "PATCH",
      }
    );

    setSaving(false);

    if (!res.ok) {
      const error = await res.text();
      alert(error);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={archiveBooking}
      disabled={saving}
      className="rounded-lg bg-gray-700 px-5 py-2 font-semibold text-white hover:bg-gray-800"
    >
      {saving ? "Archiving..." : "Archive"}
    </button>
  );
}
