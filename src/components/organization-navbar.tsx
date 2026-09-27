import Link from "next/link";
import LogoutButton from "./logout-button";

export default function OrganizationNavbar() {
  const links = [
    { href: "/organization", label: "Dashboard" },
    { href: "/organization/bookings", label: "Bookings" },
    { href: "/organization/services", label: "Services" },
    { href: "/organization/categories", label: "Categories" },
    { href: "/organization/workers", label: "Workers" },
    { href: "/organization/settings", label: "Profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-orange-200 bg-orange-100 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4">

        {/* Top Row */}
        <div className="flex items-center justify-between gap-4">

          <Link
            href="/organization"
            className="whitespace-nowrap font-serif text-xl font-bold text-orange-700"
          >
            Connect Circle
          </Link>

          <LogoutButton />

        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2">

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-orange-200"
            >
              {link.label}
            </Link>
          ))}

        </div>

      </div>
    </nav>
  );
}