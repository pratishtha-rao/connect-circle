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
<div>
  <br></br>
    <button
      onClick={restore}
      disabled={saving}
      className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
    >
      Restore Booking
    </button>
    </div>
  );
}

