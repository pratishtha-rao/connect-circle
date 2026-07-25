import Link from "next/link";

import { relativeDate } from "./relative-date";

type BookingCardProps = {
  booking: {
    id: string;
    status: string;
    date: Date;
    createdAt: Date;

    service: {
      title: string;
      duration: number;
      price: number;

      organization?: {
        name: string;
      } | null;
    };

    worker?: {
      profile: {
        fullName: string;
      };
    } | null;
  };
};

export default function BookingCard({
  booking,
}: BookingCardProps) {
  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  function StatusBadge({
    status,
  }: {
    status: string;
  }) {
    const styles = {
      PENDING:
        "bg-yellow-100 text-yellow-700",
      CONFIRMED:
        "bg-blue-100 text-blue-700",
      COMPLETED:
        "bg-green-100 text-green-700",
      CANCELLED:
        "bg-red-100 text-red-700",
    };

    const dots = {
      PENDING: "bg-yellow-500",
      CONFIRMED: "bg-blue-500",
      COMPLETED: "bg-green-500",
      CANCELLED: "bg-red-500",
    };

    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
          styles[status as keyof typeof styles]
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            dots[status as keyof typeof dots]
          }`}
        />

        {status.replace("_", " ")}
      </span>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">

      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-3">

            <h3 className="text-2xl font-bold">
              {booking.service.title}
            </h3>

            <StatusBadge status={booking.status} />

          </div>

          <p className="mt-2 text-sm text-gray-500">
            {booking.service.organization?.name}
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Appointment
              </p>

              <p className="mt-1 font-semibold">
                {relativeDate(booking.date)}
              </p>

              <p className="text-sm text-gray-500">
                {formatDate(booking.date)}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Worker
              </p>

              <p className="mt-1 font-medium">
                {booking.worker
                  ? booking.worker.profile.fullName
                  : "To be assigned"}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Duration
              </p>

              <p className="mt-1 font-medium">
                {booking.service.duration} minutes
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Price
              </p>

              <p className="mt-1 text-lg font-bold text-orange-600">
                ${booking.service.price}
              </p>

            </div>

          </div>

        </div>

        <div className="flex shrink-0 items-center">

          <Link
            href={`/customer/bookings/${booking.id}`}
            className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            View Booking →
          </Link>

        </div>

      </div>

    </div>
  );
}
