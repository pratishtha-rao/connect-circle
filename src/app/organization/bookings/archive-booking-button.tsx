"use client";

import { useState } from "react";

type Props = {
  bookingId: string;
};

export default function ArchiveBookingButton({
  bookingId,
}: Props) {
  const [saving, setSaving] = useState(false);

  async function archiveBooking() {
    const confirmed = window.confirm(
      "Archive this booking?"
    );

    if (!confirmed) return;

    setSaving(true);

    const res = await fetch(
      `/api/bookings/${bookingId}/archive`,
      {
        method: "PATCH",
      }
    );

    setSaving(false);

    if (!res.ok) {
      const error = await res.text();
      console.error(error);
      alert("Unable to archive booking.");
      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      disabled={saving}
      onClick={archiveBooking}
      className="rounded-lg bg-gray-700 px-5 py-2 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {saving ? "Archiving..." : "Archive"}
    </button>
  );
}