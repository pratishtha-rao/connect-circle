"use client";

import { useState } from "react";

type Worker = {
  id: string;
  profile: {
    fullName: string;
  };
};

type Props = {
  bookingId: string;
  workers: Worker[];
  currentWorkerId: string | null;
};

export default function AssignWorker({
  bookingId,
  workers,
  currentWorkerId,
}: Props) {
  const [selected, setSelected] = useState(
    currentWorkerId ?? ""
  );

  async function saveWorker(workerId: string) {
    setSelected(workerId);

    const res = await fetch(
      `/api/bookings/${bookingId}/assign`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerId,
        }),
      }
    );

const data = await res.json();

if (!res.ok) {
  alert(data.error);
  return;
}

alert("Employee assigned!");
window.location.reload();
  }

  return (
    <div className="space-y-3">

      <strong>Assigned Employee</strong>

      <select
        value={selected}
        onChange={(e) => saveWorker(e.target.value)}
        className="w-full rounded-lg border p-3"
      >
        <option value="">
          Unassigned
        </option>

        {workers.map((worker) => (
          <option
            key={worker.id}
            value={worker.id}
          >
            {worker.profile.fullName}
          </option>
        ))}
      </select>

    </div>
  );
}