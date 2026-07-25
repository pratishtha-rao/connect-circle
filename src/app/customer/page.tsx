import Link from "next/link";

export default function CustomerPage() {
  return (
    <main className="mx-auto max-w-6xl p-8">

      <h1 className="mb-2 text-4xl font-bold">
        Customer Dashboard
      </h1>

      <p className="mb-10 text-gray-600">
        Browse organizations, manage your bookings, and update your profile.
      </p>

      <div className="grid gap-6 md:grid-cols-3">

        <Link
          href="/customer/organizations/"
          className="rounded-2xl border bg-white p-8 shadow-sm transition hover:border-orange-500 hover:shadow-md"
        >
          <h2 className="text-2xl font-bold">
            Organizations
          </h2>

          <p className="mt-3 text-gray-600">
            Browse organizations and discover available services.
          </p>
        </Link>

        <Link
          href="/customer/bookings/"
          className="rounded-2xl border bg-white p-8 shadow-sm transition hover:border-orange-500 hover:shadow-md"
        >
          <h2 className="text-2xl font-bold">
            My Bookings
          </h2>

          <p className="mt-3 text-gray-600">
            View pending, upcoming, completed, and cancelled bookings.
          </p>
        </Link>

        <Link
          href="/customer/profile/"
          className="rounded-2xl border bg-white p-8 shadow-sm transition hover:border-orange-500 hover:shadow-md"
        >
          <h2 className="text-2xl font-bold">
            Profile
          </h2>

          <p className="mt-3 text-gray-600">
            Manage your account information and password.
          </p>
        </Link>

      </div>

    </main>
  );
}
