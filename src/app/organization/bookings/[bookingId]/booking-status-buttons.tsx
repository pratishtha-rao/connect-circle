"use client";

import { useState } from "react";

type Props = {
  bookingId: string;
  currentStatus: string;
};

export default function BookingStatusButtons({
  bookingId,
  currentStatus,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function updateStatus(newStatus: string) {
    setSaving(true);

    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    if (!res.ok) {
      alert("Failed to update booking.");
      setSaving(false);
      return;
    }

    setStatus(newStatus);
    setSaving(false);

    alert("Booking updated!");
  }

  return (
    <div className="space-y-4">

      <div>
        <strong>Current Status:</strong> {status}
      </div>

      <div className="flex flex-wrap gap-3">

        <button
          disabled={saving}
          onClick={() => updateStatus("PENDING")}
          className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white"
        >
          Pending
        </button>

        <button
          disabled={saving}
          onClick={() => updateStatus("PENDING_PAYMENT")}
          className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white"
        >
          Pending Payment
        </button>

        <button
          disabled={saving}
          onClick={() => updateStatus("CONFIRMED")}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
        >
          Confirmed
        </button>

        <button
          disabled={saving}
          onClick={() => updateStatus("COMPLETED")}
          className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white"
        >
          Completed
        </button>

      </div>

    </div>
  );
}
