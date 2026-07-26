import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import WorkerNavbar from "@/components/worker-navbar";


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
    return <p>Employee not found.</p>;
  }

  const activeBookings = worker.bookings.filter(
    (booking) => booking.workerArchivedAt === null
  );

  const now = new Date();

  const upcomingBookings = activeBookings
    .filter(
      (booking) =>
        booking.date >= now &&
        booking.status !== "COMPLETED" &&
        booking.status !== "CANCELLED"
    )
    .slice(0, 3);

  const pendingBookings = activeBookings
    .filter(
      (booking) =>
        booking.status === "PENDING" ||
        booking.status === "PENDING_APPROVAL" ||
              booking.status === "PENDING_PAYMENT"
    )
    .slice(0, 5);

  const confirmedBookings = activeBookings
    .filter((booking) => booking.status === "CONFIRMED")
    .slice(0, 5);

  const completedBookings = [...activeBookings]
    .filter((booking) => booking.status === "COMPLETED")
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const cancelledBookings = [...activeBookings]
    .filter((booking) => booking.status === "CANCELLED")
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <main className="mx-auto max-w-7xl p-8">
            <WorkerNavbar />

      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Employee Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome back, {profile.fullName}. Manage your profile,
          availability, services and schedule.
        </p>
      </div>

<div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-center text-sm text-yellow-800">
  <strong>Please note:</strong> All appointment times are displayed in the respective organization's time zone.
</div>

      <h2 className="mb-6 text-center text-3xl font-bold">
        Appointment Overview
      </h2>

      <div className="mx-auto mb-16 max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {/* Confirmed */}

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">
              Upcoming Appointments
            </h2>

            <div className="mt-4 space-y-3">

              {confirmedBookings.length === 0 ? (

                <p className="text-sm text-gray-500">
                  No confirmed appointments.
                </p>

              ) : (

                confirmedBookings.map((booking) => (

                  <div
                    key={booking.id}
                    className="rounded-lg border p-3"
                  >
                    <p className="font-semibold">
                      {booking.profile.fullName}
                    </p>

                    <p className="text-sm text-gray-600">
                      {booking.service.title}
                    </p>

                    <p className="text-xs text-orange-600 mt-1">
                      {booking.date.toLocaleString()}
                    </p>
                  </div>

                ))

              )}

            </div>
          </section>

          {/* Pending */}

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">
              Pending Approval by Organization
            </h2>

            <div className="mt-4 space-y-3">

              {pendingBookings.length === 0 ? (

                <p className="text-sm text-gray-500">
                  No pending bookings.
                </p>

              ) : (

                pendingBookings.map((booking) => (

                  <div
                    key={booking.id}
                    className="rounded-lg border p-3"
                  >
                    <p className="font-semibold">
                      {booking.profile.fullName}
                    </p>

                    <p className="text-sm text-gray-600">
                      {booking.service.title}
                    </p>
                  </div>

                ))

              )}

            </div>
          </section>


          {/* Completed */}

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">
              Completed Appointments
            </h2>

            <div className="mt-4 space-y-3">

              {completedBookings.length === 0 ? (

                <p className="text-sm text-gray-500">
                  No completed appointments.
                </p>

              ) : (

                completedBookings.map((booking) => (

                  <div
                    key={booking.id}
                    className="rounded-lg border p-3"
                  >
                    <p className="font-semibold">
                      {booking.profile.fullName}
                    </p>

                    <p className="text-sm text-gray-600">
                      {booking.service.title}
                    </p>

                    <p className="text-xs text-green-600 mt-1">
                      {booking.date.toLocaleString()}
                    </p>
                  </div>

                ))

              )}

            </div>
          </section>

          {/* Cancelled */}

          <section className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">
              Cancelled Appointments
            </h2>

            <div className="mt-4 space-y-3">

              {cancelledBookings.length === 0 ? (

                <p className="text-sm text-gray-500">
                  No cancelled appointments.
                </p>

              ) : (

                cancelledBookings.map((booking) => (

                  <div
                    key={booking.id}
                    className="rounded-lg border p-3"
                  >
                    <p className="font-semibold">
                      {booking.profile.fullName}
                    </p>

                    <p className="text-sm text-gray-600">
                      {booking.service.title}
                    </p>

                    <p className="text-xs text-red-600 mt-1">
                      {booking.date.toLocaleString()}
                    </p>
                  </div>

                ))

              )}

            </div>
          </section>

        </div>
      </div>

      <h2 className="mt-20 mb-6 text-center text-3xl font-bold">
        Management
      </h2>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {/* Profile */}

        <section className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">
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

        <section className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">

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

        <section className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">

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
  <p className="font-medium">
    {membership.organization.name}
  </p>

  <p className="mt-1 text-sm text-gray-500">
    Time Zone:{" "}
    {membership.organization.timezone ?? "Not configured"}
  </p>
</div>

              ))

            )}

          </div>

        </section>

        {/* Services */}

        <section className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">

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
                {/* My Bookings */}

        <section className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-semibold">
            My Bookings
          </h2>

          <p className="mt-2 text-gray-600">
            View and manage all appointments assigned to you.
          </p>

          <div className="mt-6 flex-1">

            <p className="text-5xl font-bold text-orange-500">
              {activeBookings.length}
            </p>

            <p className="mt-2 text-gray-600">
              active bookings
            </p>

          </div>

          <Link
            href="/worker/bookings"
            className="mt-8 rounded-lg bg-orange-500 px-5 py-3 text-center font-semibold text-white hover:bg-orange-600"
          >
            Open Booking Portal
          </Link>

        </section>

        {/* Calendar */}

{/*
        <section className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">
 
          <h2 className="text-2xl font-semibold">
            Calendar
          </h2>

          <p className="mt-2 text-gray-600">
            View your appointments in calendar format.
          </p>

          <div className="mt-6 flex-1 flex items-center">

            <p className="text-5xl">
              📅
            </p>

          </div>

          <Link
            href="/worker/calendar"
            className="mt-8 rounded-lg bg-orange-500 px-5 py-3 text-center font-semibold text-white hover:bg-orange-600"
          >
            Open Calendar
          </Link>

        </section>

        */}

      </div>

    </main>
);
}
