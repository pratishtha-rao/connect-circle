"use client";

import { useState } from "react";

export default function UnarchiveBooking({
  bookingId,
}: {
  bookingId: string;
}) {
  const [saving, setSaving] = useState(false);

  async function restore() {
    setSaving(true);

    const res = await fetch(
      `/api/bookings/${bookingId}/unarchive`,
      {
        method: "PATCH",
      }
    );

    setSaving(false);

    if (!res.ok) {
      alert("Unable to restore booking.");
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={restore}
      disabled={saving}
      className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
    >
      Restore Booking
    </button>
  );
}