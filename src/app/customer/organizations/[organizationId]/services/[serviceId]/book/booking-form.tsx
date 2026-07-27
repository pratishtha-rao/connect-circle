"use client";

import { useEffect, useState } from "react";

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
  organizationAvailabilityDays: number[];
  organizationStartTime: string | null;
  organizationEndTime: string | null;
  organizationTimezone: string | null;
};

export default function BookingForm({
  serviceId,
  allowWorkerSelection,
  instructions,
  organizationNotes,
  paymentInstructions,
  workers,
  organizationAvailabilityDays,
organizationStartTime,
organizationEndTime,
organizationTimezone,
}: Props) {
  const [workerId, setWorkerId] = useState("");
const [selectedDate, setSelectedDate] = useState("");
const [selectedTime, setSelectedTime] = useState("");
const [loadingTimes, setLoadingTimes] = useState(false);

function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

type AvailableSlot = {
  time: string;
  workerId: string;
};

const [availableTimes, setAvailableTimes] = useState<AvailableSlot[]>([]);
const [selectedSlot, setSelectedSlot] =
  useState<AvailableSlot | null>(null);

const selectedWorker = workers.find(
  (w) => w.id === workerId
);

const weekday = selectedDate
  ? (() => {
      const [year, month, day] = selectedDate
        .split("-")
        .map(Number);

      return new Date(
        year,
        month - 1,
        day
      ).getDay();
    })()
  : null;
  
  useEffect(() => {
  if (!selectedDate) {
    setAvailableTimes([]);
    return;
  }

  if (allowWorkerSelection && !workerId) {
    setAvailableTimes([]);
    return;
  }

  async function loadAvailability() {
    setLoadingTimes(true);

    try {
      const params = new URLSearchParams({
        serviceId,
        date: selectedDate,
      });

      if (workerId) {
        params.append("workerId", workerId);
      }

      const res = await fetch(
        `/api/availability?${params}`
      );

      const data = await res.json();

      setAvailableTimes(data.times ?? []);
      setSelectedTime("");
    } catch (err) {
      console.error(err);
      setAvailableTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  }

  loadAvailability();
}, [
  selectedDate,
  workerId,
  serviceId,
  allowWorkerSelection,
]);


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

{workers.length === 0 && (
  <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-center text-md text-yellow-800">
    No employees are currently assigned to this service.
    <br />
    Please choose another service.
  </div>
)}

{organizationTimezone && (
    <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-100 p-4 text-center text-sm">
  <p className="mt-2 text-md text-black">
    All appointment times are shown in the organization's timezone ({organizationTimezone}).
  </p>
  </div>
)}

      <div className="rounded-xl border bg-blue-100 p-8 shadow-sm">

{allowWorkerSelection && (
  <div className="mb-6">
    <label className="mb-2 block font-medium">
      Choose Employee
    </label>

{workers.length > 0 && (
  <select
    value={workerId}
    onChange={(e) => {
      setWorkerId(e.target.value);
      setSelectedTime("");
    }}
    className="w-full rounded-lg border p-3"
  >        <option value="">
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
  onChange={(e) => {
    const slot = availableTimes.find(
      (s) => s.time === e.target.value
    );

    if (!slot) return;

    setSelectedTime(slot.time);
    setSelectedSlot(slot);

    if (!allowWorkerSelection) {
      setWorkerId(slot.workerId);
    }
  }}
  className="w-full rounded-lg border p-3"
>
    <option value="">
    {loadingTimes ? "Loading..." : "Select Time"}
  </option>

{availableTimes.map((slot) => (
  <option
    key={`${slot.workerId}-${slot.time}`}
    value={slot.time}
  >
    {slot.time}
  </option>
))}
</select>

{!loadingTimes &&
  selectedDate &&
  availableTimes.length === 0 && (
    <p className="mt-2 text-sm text-red-600">
      No appointments are available for this day.
    </p>
)}

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
            placeholder="Anything the organization or employee should know..."
          />
        </div>

        <button
          type="button"
          onClick={submitBooking}
disabled={
  saving ||
  (allowWorkerSelection && workers.length === 0)
}          className="mt-8 rounded-lg bg-orange-500 px-6 py-3 font-timesnewroman text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "Booking..." : "Book Appointment"}
        </button>

      </div>

      {instructions && (
        <div className="rounded-xl border bg-yellow-100 p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Service Instructions
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-gray-700">
            {instructions}
          </p>
        </div>
      )}

      {organizationNotes && (
        <div className="rounded-xl border bg-violet-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Organization Booking Notes
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-gray-700">
            {organizationNotes}
          </p>
        </div>
      )}

      {paymentInstructions && (
        <div className="rounded-xl border bg-green-100 p-6 shadow-sm">
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


