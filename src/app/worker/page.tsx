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
        take: 5,
        include: {
          service: true,
          profile: true,
        },
      },
    },
  });

  if (!worker) {
    return <p>Worker not found.</p>;
  }

  return (
    <main className="mx-auto max-w-6xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Worker Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Profile */}

        <div className="rounded-xl border p-6 shadow-sm">

          <h2 className="mb-4 text-2xl font-semibold">
            Profile
          </h2>

          <p>
            <strong>Name:</strong> {profile.fullName}
          </p>

          <p>
            <strong>Email:</strong> {profile.email}
          </p>

          <p>
            <strong>Bio:</strong>{" "}
            {worker.bio || "Not added yet"}
          </p>

          <div className="mt-6">
            <Link
              href="/worker/profile"
              className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white"
            >
              Edit Profile
            </Link>
          </div>

        </div>

        {/* Organizations */}

        <div className="rounded-xl border p-6 shadow-sm">

          <h2 className="mb-4 text-2xl font-semibold">
            Organizations
          </h2>

          {worker.organizations.length === 0 ? (
            <p>No organizations.</p>
          ) : (
            <ul className="space-y-2">

              {worker.organizations.map((membership) => (

                <li key={membership.id}>
                  {membership.organization.name}
                </li>

              ))}

            </ul>
          )}

        </div>

        {/* Services */}

        <div className="rounded-xl border p-6 shadow-sm">

          <h2 className="mb-4 text-2xl font-semibold">
            Services
          </h2>

          {worker.services.length === 0 ? (
            <p>No services assigned.</p>
          ) : (
            <ul className="space-y-2">

              {worker.services.map((service) => (

                <li key={service.id}>
                  {service.service.title}
                </li>

              ))}

            </ul>
          )}

        </div>

        {/* Availability */}

        <div className="rounded-xl border p-6 shadow-sm">

          <h2 className="mb-4 text-2xl font-semibold">
            Availability
          </h2>

          <p>
            {worker.availability.length} schedule entries
          </p>

          <div className="mt-6">

            <Link
              href="/worker/availability"
              className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white"
            >
              Edit Availability
            </Link>

          </div>

        </div>

      </div>

      {/* Upcoming Bookings */}

      <div className="mt-10 rounded-xl border p-6 shadow-sm">

        <h2 className="mb-5 text-2xl font-semibold">
          Upcoming Bookings
        </h2>

        {worker.bookings.length === 0 ? (
          <p>No upcoming bookings.</p>
        ) : (
          <div className="space-y-4">

            {worker.bookings.map((booking) => (

              <div
                key={booking.id}
                className="rounded-lg border p-4"
              >
                <p>
                  <strong>Customer:</strong>{" "}
                  {booking.profile.fullName}
                </p>

                <p>
                  <strong>Service:</strong>{" "}
                  {booking.service.title}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {booking.date.toLocaleString()}
                </p>

              </div>

            ))}

          </div>
        )}

      </div>

    </main>
  );
}