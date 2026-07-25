"use client";

import { useState } from "react";

type Worker = {
  id: string;
  name: string;
  availability: {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
};

type Props = {
  serviceId: string;
  organizationId: string;
  allowWorkerSelection: boolean;
  instructions: string | null;
  organizationNotes: string | null;
  paymentInstructions: string | null;
  workers: Worker[];
};

export default function BookingForm({
  serviceId,
  allowWorkerSelection,
  instructions,
  organizationNotes,
  paymentInstructions,
  workers,
}: Props) {
  const [workerId, setWorkerId] = useState("");
const [selectedDate, setSelectedDate] = useState("");
const [selectedTime, setSelectedTime] = useState("");

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function generateTimes(
  start: string,
  end: string
) {
  const times: string[] = [];

  let [hour, minute] = start
    .split(":")
    .map(Number);

  const [endHour, endMinute] = end
    .split(":")
    .map(Number);

  while (
    hour < endHour ||
    (hour === endHour &&
      minute < endMinute)
  ) {
    times.push(
      `${hour
        .toString()
        .padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`
    );

    minute += 30;

    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }

  return times;
}

const selectedWorker = workers.find(
  (w) => w.id === workerId
);

const weekday = selectedDate
  ? new Date(selectedDate).getDay()
  : null;

const availability =
  allowWorkerSelection &&
  selectedWorker &&
  weekday !== null
    ? selectedWorker.availability.find(
        (a) => a.dayOfWeek === weekday
      )
    : null;

const availableTimes =
  availability
    ? generateTimes(
        availability.startTime,
        availability.endTime
      )
    : [];

  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function submitBooking() {
    if (
  !selectedDate ||
  !selectedTime) {
      alert("Please choose a date and time.");
      return;
    }

    if (allowWorkerSelection && !workerId) {
      alert("Please choose a worker.");
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
          workerId,
          date: `${selectedDate}T${selectedTime}`,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Something went wrong.");
        return;
      }

      alert("Booking created!");

window.location.href = `/customer/bookings/${data.booking.id}`;    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">

      <div className="rounded-xl border bg-white p-8 shadow-sm">

{allowWorkerSelection && (
  <div className="mb-6">
    <label className="mb-2 block font-medium">
      Choose Worker
    </label>

    {workers.length === 0 ? (
      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
        No workers are currently assigned to this service.
        <br />
        Please contact the organization or choose another service.
      </div>
    ) : (
      <select
        value={workerId}
        onChange={(e) => {
          setWorkerId(e.target.value);
          setSelectedTime("");
        }}
        className="w-full rounded-lg border p-3"
      >
        <option value="">
          Select a worker
        </option>

        {workers.map((worker) => (
          <option
            key={worker.id}
            value={worker.id}
          >
            {worker.name}
          </option>
        ))}
      </select>
    )}
  </div>
)}

<div className="space-y-5">

  <div>

    <label className="mb-2 block font-medium">
      Appointment Date
    </label>

<input
  type="date"
  min={formatDate(new Date())}
  value={selectedDate}
  onChange={(e) => {
    setSelectedDate(e.target.value);
    setSelectedTime("");
  }}
  className="w-full rounded-lg border p-3"
/>

  </div>

  <div>

    <label className="mb-2 block font-medium">
      Appointment Time
    </label>

    <select
      value={selectedTime}
      onChange={(e) =>
        setSelectedTime(e.target.value)
      }
      className="w-full rounded-lg border p-3"
    >
      <option value="">
        Select Time
      </option>

      {availableTimes.map((time) => (
        <option
          key={time}
          value={time}
        >
          {time}
        </option>
      ))}

    </select>

</div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block font-medium">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            rows={4}
            className="w-full rounded-lg border p-3"
            placeholder="Anything the organization or worker should know..."
          />
        </div>

        <button
          type="button"
          onClick={submitBooking}
disabled={
  saving ||
  (allowWorkerSelection && workers.length === 0)
}          className="mt-8 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "Booking..." : "Book Appointment"}
        </button>

      </div>

      {instructions && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Service Instructions
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-gray-700">
            {instructions}
          </p>
        </div>
      )}

      {organizationNotes && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Organization Booking Notes
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-gray-700">
            {organizationNotes}
          </p>
        </div>
      )}

      {paymentInstructions && (
        <div className="rounded-xl border bg-orange-50 p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Payment Instructions
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-gray-700">
            {paymentInstructions}
          </p>
        </div>
      )}

    </div>
  );
}


