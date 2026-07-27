import Link from "next/link";
import LogoutButton from "./logout-button";

export default function OrganizationNavbar() {
  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-orange-200 bg-orange-100 shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-8">

          {/* Logo */}
          <Link
            href="/organization"
            className="font-serif text-lg font-bold text-orange-700"
          >
            Connect Circle
          </Link>

          {/* Center Links */}
          <div className="ml-20 mr-auto flex h-full items-center">

            <Link
              href="/organization"
              className="flex h-full items-center px-6 text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-orange-200"
            >
              Dashboard
            </Link>

            <Link
              href="/organization/bookings"
              className="flex h-full items-center px-6 text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-orange-200"
            >
              Bookings
            </Link>

            <Link
              href="/organization/services"
              className="flex h-full items-center px-6 text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-orange-200"
            >
              Services
            </Link>

            <Link
              href="/organization/categories"
              className="flex h-full items-center px-6 text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-orange-200"
            >
              Categories
            </Link>

            <Link
              href="/organization/workers"
              className="flex h-full items-center px-6 text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-orange-200"
            >
              Manage Workers
            </Link>

            <Link
              href="/organization/settings"
              className="flex h-full items-center px-6 text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-orange-200"
            >
              Profile
            </Link>

          </div>

<div className="ml-auto flex items-center"> </div>
<div className="flex h-full items-center"> </div>
          <LogoutButton />

        </div>
      </nav>

      <div className="h-12" />
    </>
  );
}