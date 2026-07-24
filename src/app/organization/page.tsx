import Link from "next/link";

export default function OrganizationPage() {
  return (
    <main className="mx-auto max-w-7xl p-8">

      <h1 className="text-4xl font-bold text-gray-900">
        Organization Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Welcome back. Manage every part of your business from one place.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {/* Bookings */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Bookings
          </h2>

          <p className="mt-2 text-gray-600">
            Manage appointments, confirmations, cancellations and archives.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              href="/organization/bookings"
              className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              View Bookings
            </Link>

            <Link
              href="/organization/bookings/archive"
              className="rounded-lg border px-5 py-3 hover:bg-gray-50"
            >
              Archived Bookings
            </Link>

          </div>
        </section>

        {/* Services */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Services
          </h2>

          <p className="mt-2 text-gray-600">
            Create and manage all services offered by your organization.
          </p>

          <Link
            href="/organization/services"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Manage Services
          </Link>
        </section>

        {/* Workers */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Workers
          </h2>

          <p className="mt-2 text-gray-600">
            Add workers, assign bookings and manage schedules.
          </p>

          <Link
            href="/organization/workers"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Manage Workers
          </Link>
        </section>

        {/* Categories */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Categories
          </h2>

          <p className="mt-2 text-gray-600">
            Organize your services into categories.
          </p>

          <Link
            href="/organization/categories"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Manage Categories
          </Link>
        </section>

        {/* Calendar */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Calendar
          </h2>

          <p className="mt-2 text-gray-600">
            View appointments by day, week or month.
          </p>

          <Link
            href="/organization/calendar"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Open Calendar
          </Link>
        </section>

        {/* Settings */}

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Settings
          </h2>

          <p className="mt-2 text-gray-600">
            Update organization information and preferences.
          </p>

          <Link
            href="/organization/settings"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Organization Settings
          </Link>
        </section>

      </div>

    </main>
  );
}