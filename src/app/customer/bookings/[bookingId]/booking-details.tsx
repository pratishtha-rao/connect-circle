"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Booking = {
  id: string;
  status: string;
  date: string;
  notes: string;
  organizationNotes: string;
  cancellationReason: string;
  customerCancellationReason: string;
  workerCancellationReason: string;
  customerCancelledAt: string | null;
  workerCancelledAt: string | null;
  cancelledAt: string | null;

  service: {
    id: string;
    title: string;
    description: string;
    duration: number;
    price: number;
    instructions: string;
  };

  organization: {
    name: string;
    bookingNotes: string;
    paymentInstructions: string;
  };

  worker: {
    id: string;
    name: string;
  } | null;

  payment: {
    id: string;
    status: string;
    amount: number;
  } | null;
};

type Props = {
  booking: Booking;
};

export default function BookingDetails({
  booking,
}: Props) {
  const router = useRouter();

  const [notes, setNotes] = useState(
    booking.notes
  );

  const [saving, setSaving] =
    useState(false);

  const [canceling, setCanceling] =
    useState(false);

  const canCancel =
    booking.status === "PENDING" ||
    booking.status === "CONFIRMED";

  async function saveNotes() {
    setSaving(true);

    const res = await fetch(
  `/api/bookings/${booking.id}/customer`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          notes,
        }),
      }
    );

    setSaving(false);

    if (!res.ok) {
      alert(
        "Unable to save notes."
      );
      return;
    }

    alert("Notes updated.");
  }

  async function cancelBooking() {
    if (
      !confirm(
        "Cancel this booking?"
      )
    )
      return;

    setCanceling(true);

    const res = await fetch(
  `/api/bookings/${booking.id}/customer`,
      {
        method: "DELETE",
      }
    );

    setCanceling(false);

    if (!res.ok) {
      alert(
        "Unable to cancel booking."
      );
      return;
    }

    router.refresh();
  }

  return (
    <main className="mx-auto max-w-5xl p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Booking Details
          </h1>

        </div>

        <span className="rounded-full bg-orange-100 px-5 py-2 font-semibold text-orange-700">
          {booking.status}
        </span>

      </div>

      <div className="space-y-6">

        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold">
            Appointment
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>
              <p className="font-semibold">
                Service
              </p>

              <p>
                {booking.service.title}
              </p>
            </div>

            <div>
              <p className="font-semibold">
                Organization
              </p>

              <p>
                {booking.organization.name}
              </p>
            </div>

            <div>
              <p className="font-semibold">
                Date
              </p>

              <p>
                {new Date(
                  booking.date
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="font-semibold">
                Duration
              </p>

              <p>
                {
                  booking.service
                    .duration
                }{" "}
                min
              </p>
            </div>

            <div>
              <p className="font-semibold">
                Worker
              </p>

              <p>
                {booking.worker
                  ?.name ??
                  "To be assigned"}
              </p>
            </div>

            <div>
              <p className="font-semibold">
                Price
              </p>

              <p>
                $
                {
                  booking.service
                    .price
                }
              </p>
            </div>

          </div>

        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            Your Notes
          </h2>

          <textarea
            rows={5}
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
            className="mt-4 w-full rounded-lg border p-3"
          />

          <button
            onClick={saveNotes}
            disabled={saving}
            className="mt-4 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            {saving
              ? "Saving..."
              : "Save Notes"}
          </button>

        </section>

        {booking.service
          .instructions && (
          <section className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Service Instructions
            </h2>

            <p className="mt-4 whitespace-pre-wrap">
              {
                booking.service
                  .instructions
              }
            </p>

          </section>
        )}

        {booking.organization
          .bookingNotes && (
          <section className="rounded-xl border bg-blue-50 p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Organization Booking
              Notes
            </h2>

            <p className="mt-4 whitespace-pre-wrap">
              {
                booking
                  .organization
                  .bookingNotes
              }
            </p>

          </section>
        )}

        {booking.organization
          .paymentInstructions && (
          <section className="rounded-xl border bg-orange-50 p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Payment Instructions
            </h2>

            <p className="mt-4 whitespace-pre-wrap">
              {
                booking
                  .organization
                  .paymentInstructions
              }
            </p>

          </section>
        )}

        {booking
          .organizationNotes && (
          <section className="rounded-xl border bg-green-50 p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Organization Update
            </h2>

            <p className="mt-4 whitespace-pre-wrap">
              {
                booking
                  .organizationNotes
              }
            </p>

          </section>
        )}

        {booking.payment && (
          <section className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Payment
            </h2>

            <div className="mt-4">

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {
                  booking.payment
                    .status
                }
              </p>

              <p className="mt-2">
                <strong>
                  Amount:
                </strong>{" "}
                $
                {
                  booking.payment
                    .amount
                }
              </p>

            </div>

          </section>
        )}

{booking.customerCancelledAt && (
  <section className="rounded-xl border bg-red-50 p-6 shadow-sm">
    <h2 className="text-xl font-bold text-red-700">
      Cancelled by You
    </h2>

    <p className="mt-4">
      {booking.customerCancellationReason}
    </p>
  </section>
)}

{booking.workerCancelledAt && (
  <section className="rounded-xl border bg-orange-50 p-6 shadow-sm">
    <h2 className="text-xl font-bold text-orange-700">
      Cancelled by Worker
    </h2>

    <p className="mt-4">
      {booking.workerCancellationReason}
    </p>
  </section>
)}

{booking.cancelledAt && (
  <section className="rounded-xl border bg-red-50 p-6 shadow-sm">
    <h2 className="text-xl font-bold text-red-700">
      Cancelled by Organization
    </h2>

    <p className="mt-4">
      {booking.cancellationReason}
    </p>
  </section>
)}
        <div className="flex gap-4">

          <Link
            href="/customer"
            className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-50"
          >
            Back
          </Link>

          {canCancel && (
            <button
              disabled={canceling}
              onClick={
                cancelBooking
              }
              className="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
            >
              {canceling
                ? "Cancelling..."
                : "Cancel Booking"}
            </button>
          )}

        </div>

      </div>

    </main>
  );
}