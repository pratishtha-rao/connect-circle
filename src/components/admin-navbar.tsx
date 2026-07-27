import Link from "next/link";
import LogoutButton from "./logout-button";

export default function AdminNavbar() {
  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-orange-200 bg-orange-100 shadow-sm">
        <div className="mx-auto flex min-h-20 w-full max-w-screen-2xl items-center px-8">

          {/* Logo */}
          <Link
            href="/admin"
            className="whitespace-nowrap font-serif text-lg font-bold text-orange-700"
          >
            Connect Circle
          </Link>

          {/* Center Links */}
          <div className="ml-32 mr-auto flex h-full items-center">

            <Link
              href="/admin"
              className="flex h-full items-center px-6 text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-orange-200"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/organizations"
              className="flex h-full items-center px-6 text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-orange-200"
            >
              Organizations
            </Link>

            <Link
              href="/admin/users"
              className="flex h-full items-center px-6 text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-orange-200"
            >
              Users
            </Link>

            <Link
              href="/admin/services"
              className="flex h-full items-center px-6 text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-orange-200"
            >
              Services
            </Link>

          </div>

<div className="ml-auto flex items-center"> </div>
<div className="flex h-full items-center"> </div>
          <LogoutButton />

          {/* Logout */}
          <LogoutButton />

        </div>
      </nav>
    </>
  );
}

      {/* Space below navbar */}
     // <div className="h-12" />
