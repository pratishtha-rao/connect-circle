"use client";

import { useState } from "react";

type Props = {
  serviceId: string;
};

export default function BookingForm({
  serviceId,
}: Props) {
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function submitBooking() {
    if (!date) {
      alert("Please choose a date and time.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          date,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Something went wrong.");
        return;
      }

      alert("Booking created!");

      window.location.href = "/services";
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 rounded-xl border bg-white p-8 shadow-sm">
      <div>
        <label className="mb-2 block font-medium">
          Appointment Date
        </label>

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Notes
        </label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <button
        type="button"
        onClick={submitBooking}
        disabled={saving}
        className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
}
