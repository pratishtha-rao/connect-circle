"use client";

import { useState } from "react";

export default function CancelBooking({
  bookingId,
}: {
  bookingId: string;
}) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function cancelBooking() {
    if (!reason.trim()) {
      alert("Please enter a cancellation reason.");
      return;
    }

    setSaving(true);

    const res = await fetch(
      `/api/bookings/${bookingId}/cancel`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason,
        }),
      }
    );

    setSaving(false);

if (!res.ok) {
  const error = await res.text();
  console.error(error);
  alert(error);
  return;
}
    alert("Booking cancelled.");

    window.location.reload();
  }

  return (
    <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">

      <h2 className="text-xl font-semibold text-red-700">
        Cancel Booking
      </h2>

      <p className="mt-2 text-gray-600">
        The customer will be able to see this reason.
      </p>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={4}
        placeholder="Reason for cancellation..."
        className="mt-4 w-full rounded-lg border p-3"
      />

      <button
        onClick={cancelBooking}
        disabled={saving}
        className="mt-5 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
      >
        {saving ? "Cancelling..." : "Cancel Booking"}
      </button>

    </div>
  );
}