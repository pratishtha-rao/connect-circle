"use client";

import { useState } from "react";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type Availability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export default function AvailabilityForm({
  existing,
}: {
  existing: Availability[];
}) {
  const [days, setDays] = useState(
    DAYS.map((name, index) => {
      const found = existing.find(
        (d) => d.dayOfWeek === index
      );

      return {
        dayOfWeek: index,
        name,
        enabled: !!found,
        startTime: found?.startTime ?? "09:00",
        endTime: found?.endTime ?? "17:00",
      };
    })
  );

  async function save() {
    const res = await fetch(
      "/api/worker/availability",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(days),
      }
    );

    if (!res.ok) {
      alert("Failed to save.");
      return;
    }

    alert("Availability saved!");
  }

  return (
    <div className="space-y-5">

      {days.map((day, index) => (

        <div
          key={day.dayOfWeek}
          className="rounded-xl border p-5"
        >

          <div className="flex items-center gap-4">

            <input
              type="checkbox"
              checked={day.enabled}
              onChange={(e) => {
                const copy = [...days];
                copy[index].enabled =
                  e.target.checked;
                setDays(copy);
              }}
            />

            <h2 className="w-28 font-semibold">
              {day.name}
            </h2>

            <input
              type="time"
              value={day.startTime}
              disabled={!day.enabled}
              onChange={(e) => {
                const copy = [...days];
                copy[index].startTime =
                  e.target.value;
                setDays(copy);
              }}
              className="rounded border p-2"
            />

            <span>to</span>

            <input
              type="time"
              value={day.endTime}
              disabled={!day.enabled}
              onChange={(e) => {
                const copy = [...days];
                copy[index].endTime =
                  e.target.value;
                setDays(copy);
              }}
              className="rounded border p-2"
            />

          </div>

        </div>

      ))}

      <button
        onClick={save}
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
      >
        Save Availability
      </button>

    </div>
  );
}