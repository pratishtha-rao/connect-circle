"use client";

import { useState } from "react";

export default function UnarchiveBooking({
  bookingId,
}: {
  bookingId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function unarchive() {
    setLoading(true);

    const res = await fetch(
      `/api/workers/bookings/${bookingId}/unarchive`,
      {
        method: "PATCH",
      }
    );

    setLoading(false);

    if (!res.ok) {
      alert("Unable to restore booking.");
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={unarchive}
      disabled={loading}
      className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
    >
      {loading ? "Restoring..." : "Restore Booking"}
    </button>
  );
}
