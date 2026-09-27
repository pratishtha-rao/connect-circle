import Link from "next/link";

export default function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-orange-200 bg-orange-100 shadow-sm">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="font-serif text-xl font-bold text-orange-700"
        >
          Connect Circle
        </Link>

        <Link
          href="/"
          className="rounded-full border border-orange-300 px-4 py-2 text-sm font-medium transition hover:bg-orange-200"
        >
          ← Back to Home
        </Link>

      </div>
    </nav>
  );
}