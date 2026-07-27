import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-orange-100">

      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <h1 className="text-3xl font-bold text-orange-600">
            Connect Circle
          </h1>

          <div className="flex gap-4">

            <Link
              href="/login"
              className="rounded-lg border px-5 py-2 font-medium hover:bg-orange-200"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-orange-500 px-5 py-2 font-medium text-white hover:bg-orange-600"
            >
              Sign Up
            </Link>

          </div>

        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-8 py-24 text-center">

        <h2 className="max-w-4xl text-6xl font-bold leading-tight">

          Book Trusted Services

          <span className="text-orange-600">
            {" "}Through Your Community
          </span>

        </h2>

        <p className="mt-8 max-w-3xl text-timesnewroman text-xl text-gray-600">

          Connect Circle helps people discover organizations,
          find trusted employees, book services,
          and manage appointments in one place.

        </p>

        <div className="mt-10 flex gap-4">

          <Link
            href="/signup"
            className="rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-600"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-xl border px-8 py-4 text-lg font-semibold hover:bg-orange-200"
          >
            Login
          </Link>

        </div>

      </section>

{/* Features */}
<section className="mx-auto grid max-w-7xl gap-8 px-8 pb-24 md:grid-cols-3">

  <div className="rounded-2xl border p-8 shadow-sm transition hover:shadow-md">

    <h3 className="text-2xl font-bold">
      Organizations
    </h3>

    <p className="mt-4 text-gray-600">
      Streamline your operations with one powerful platform. Manage services,
      employees, schedules, bookings, and customer communication from just one dashboard.
    </p>

  </div>

  <div className="rounded-2xl border p-8 shadow-sm transition hover:shadow-md">

    <h3 className="text-2xl font-bold">
      Customers
    </h3>

    <p className="mt-4 text-gray-600">
      Discover trusted organizations, browse available services, and book
      appointments in minutes. View upcoming bookings, receive updates, and
      manage everything in one place.
    </p>

  </div>

  <div className="rounded-2xl border p-8 shadow-sm transition hover:shadow-md">

    <h3 className="text-2xl font-bold">
      Employees
    </h3>

    <p className="mt-4 text-gray-600">
      Stay organized with a personalized schedule, manage your availability,
      review appointments, and access booking details so you can focus on
      delivering excellent service.
    </p>

  </div>

</section>

    </main>
  );
}