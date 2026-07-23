import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export default async function WorkerDashboard() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const worker = await prisma.worker.findUnique({
    where: {
      profileId: profile.id,
    },
    include: {
      organizations: {
        include: {
          organization: true,
        },
      },
      services: {
        include: {
          service: true,
        },
      },
      availability: true,
      bookings: {
        orderBy: {
          date: "asc",
        },
        include: {
          profile: true,
          service: true,
        },
      },
    },
  });

  if (!worker) {
    return <p>Worker not found.</p>;
  }

  return (
    <main className="mx-auto max-w-7xl p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Worker Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome back, {profile.fullName}. Manage your profile,
          availability, services and schedule.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Profile */}

        <section className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Profile
          </h2>

          <p className="mt-2 text-gray-600">
            Keep your information up to date.
          </p>

          <div className="mt-6 flex-1 space-y-3">
            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p>{profile.fullName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p>{profile.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Bio
              </p>

              <p>{worker.bio || "Not completed"}</p>
            </div>
          </div>

          <Link
            href="/worker/profile"
            className="mt-8 rounded-lg bg-orange-500 px-5 py-3 text-center font-semibold text-white hover:bg-orange-600"
          >
            Manage Profile
          </Link>
        </section>

        {/* Availability */}

        <section className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Availability
          </h2>

          <p className="mt-2 text-gray-600">
            Configure when customers can book you.
          </p>

          <div className="mt-6 flex-1">
            <p className="text-5xl font-bold text-orange-500">
              {worker.availability.length}
            </p>

            <p className="mt-2 text-gray-600">
              schedule entries
            </p>
          </div>

          <Link
            href="/worker/availability"
            className="mt-8 rounded-lg bg-orange-500 px-5 py-3 text-center font-semibold text-white hover:bg-orange-600"
          >
            Manage Availability
          </Link>
        </section>

        {/* Organizations */}

        <section className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Organizations
          </h2>

          <p className="mt-2 text-gray-600">
            Organizations you're connected with.
          </p>

          <div className="mt-6 flex-1 space-y-3">
            {worker.organizations.length === 0 ? (
              <p className="text-gray-500">
                No organizations.
              </p>
            ) : (
              worker.organizations.map((membership) => (
                <div
                  key={membership.id}
                  className="rounded-lg border p-3"
                >
                  {membership.organization.name}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Services */}

        <section className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Services
          </h2>

          <p className="mt-2 text-gray-600">
            Services assigned to you.
          </p>

          <div className="mt-6 flex-1">
            <p className="text-5xl font-bold text-orange-500">
              {worker.services.length}
            </p>

            <p className="mt-2 text-gray-600">
              assigned service
              {worker.services.length !== 1 && "s"}
            </p>
          </div>

          <Link
            href="/worker/services"
            className="mt-8 rounded-lg bg-orange-500 px-5 py-3 text-center font-semibold text-white hover:bg-orange-600"
          >
            View Services
          </Link>
        </section>

        {/* Schedule */}

        <section className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Schedule
          </h2>

          <p className="mt-2 text-gray-600">
            View your upcoming appointments.
          </p>

          <div className="mt-6 flex-1">
            <p className="text-5xl font-bold text-orange-500">
              {worker.bookings.length}
            </p>

            <p className="mt-2 text-gray-600">
              upcoming appointment
              {worker.bookings.length !== 1 && "s"}
            </p>
          </div>

          <Link
            href="/worker/schedule"
            className="mt-8 rounded-lg bg-orange-500 px-5 py-3 text-center font-semibold text-white hover:bg-orange-600"
          >
            View Schedule
          </Link>
        </section>

      </div>
    </main>
  );
}