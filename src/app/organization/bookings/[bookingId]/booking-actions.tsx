"use client";

import { useRouter } from "next/navigation";

type Props = {
  bookingId: string;
};

export default function BookingActions({
  bookingId,
}: Props) {
  const router = useRouter();

  async function updateStatus(status: string) {
    const res = await fetch(
      `/api/bookings/${bookingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to update booking.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3">

      <button
        onClick={() => updateStatus("CONFIRMED")}
        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
      >
        Confirm
      </button>

      <button
        onClick={() => updateStatus("COMPLETED")}
        className="rounded-lg bg-green-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
      >
        Complete
      </button>

      <button
        onClick={() => updateStatus("CANCELLED")}
        className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
      >
        Cancel
      </button>

    </div>
  );
}