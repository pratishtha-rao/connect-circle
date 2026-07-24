"use client";

import { useState } from "react";

type Props = {
  bookingId: string;
  status: string;
  workerCancelled: boolean;
  organizationCancelled: boolean;
};

export default function WorkerCancelBooking({
  bookingId,
  status,
  workerCancelled,
  organizationCancelled,
}: Props) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function cancelBooking() {
    if (!reason.trim()) {
      alert("Please provide a cancellation reason.");
      return;
    }

    setSaving(true);

    const res = await fetch(
      `/api/workers/bookings/${bookingId}/cancel`,
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
      alert("Unable to cancel booking.");
      return;
    }

    window.location.reload();
  }

  async function undoCancel() {
    setSaving(true);

    const res = await fetch(
      `/api/workers/bookings/${bookingId}/undo-cancel`,
      {
        method: "PATCH",
      }
    );

    setSaving(false);

    if (!res.ok) {
      alert("Unable to undo cancellation.");
      return;
    }

    window.location.reload();
  }

  if (organizationCancelled) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-semibold text-red-700">
          Booking Cancelled
        </h2>

        <p className="mt-2 text-gray-700">
          This booking was cancelled by the organization.
        </p>
      </div>
    );
  }

  if (workerCancelled) {
    return (
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">

        <h2 className="text-xl font-semibold">
          You cancelled this booking
        </h2>

        <button
          onClick={undoCancel}
          disabled={saving}
          className="mt-5 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          {saving ? "Restoring..." : "Undo Cancellation"}
        </button>

      </div>
    );
  }

  if (status === "COMPLETED") {
    return null;
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">

      <h2 className="text-xl font-semibold text-red-700">
        Cancel Booking
      </h2>

      <p className="mt-2 text-gray-600">
        The customer and organization will see this reason.
      </p>

      <textarea
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="mt-4 w-full rounded-lg border p-3"
        placeholder="Reason..."
      />

      <button
        onClick={cancelBooking}
        disabled={saving}
        className="mt-5 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white"
      >
        {saving ? "Cancelling..." : "Cancel Booking"}
      </button>

    </div>
  );
}