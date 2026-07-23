import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <h1 className="text-3xl font-bold text-blue-600">
            Connect Circle
          </h1>

          <div className="flex gap-4">

            <Link
              href="/login"
              className="rounded-lg border px-5 py-2 font-medium hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
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

          <span className="text-blue-600">
            {" "}Through Your Community
          </span>

        </h2>

        <p className="mt-8 max-w-3xl text-xl text-gray-600">

          Connect Circle helps people discover organizations,
          find trusted workers, book services,
          and manage appointments in one place.

        </p>

        <div className="mt-10 flex gap-4">

          <Link
            href="/signup"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-xl border px-8 py-4 text-lg font-semibold hover:bg-gray-100"
          >
            Login
          </Link>

        </div>

      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-7xl gap-8 px-8 pb-24 md:grid-cols-3">

        <div className="rounded-2xl border p-8 shadow-sm">

          <h3 className="text-2xl font-bold">
            Organizations
          </h3>

          <p className="mt-4 text-gray-600">

            Discover temples, nonprofits, businesses,
            and other organizations.

          </p>

        </div>

        <div className="rounded-2xl border p-8 shadow-sm">

          <h3 className="text-2xl font-bold">
            Services
          </h3>

          <p className="mt-4 text-gray-600">

            Browse available services,
            compare options,
            and book online.

          </p>

        </div>

        <div className="rounded-2xl border p-8 shadow-sm">

          <h3 className="text-2xl font-bold">
            Trusted Workers
          </h3>

          <p className="mt-4 text-gray-600">

            Book verified workers
            or independent professionals.

          </p>

        </div>

      </section>

    </main>
  );
}