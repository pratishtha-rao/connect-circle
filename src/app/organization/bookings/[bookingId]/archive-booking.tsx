"use client";

import { useState } from "react";

export default function ArchiveBooking({
  bookingId,
}: {
  bookingId: string;
}) {
  const [saving, setSaving] = useState(false);

  
  async function archiveBooking() {
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
  alert(error);
  return;
}

    alert("Booking archived.");

    window.location.href = "/organization/bookings";
  }

  return (
    <div className="mt-10 rounded-xl border border-gray-300 bg-gray-50 p-6">

      <h2 className="text-xl font-semibold">
        Archive Booking
      </h2>

<button
  onClick={archiveBooking}
  disabled={saving}
  className="rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white"
>
  Archive Booking
</button>

    </div>
  );
}


