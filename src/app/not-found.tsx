import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-4 text-5xl font-bold">404</h1>

      <p className="mb-8 text-lg text-gray-600">
        The page you are looking for does not exist.
      </p>

      <Link
        href="/dashboard"
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
      >
        Go back to Dashboard
      </Link>
    </main>
  );
}