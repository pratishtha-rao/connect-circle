import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import CopyInviteButton from "./copy-invite-button";

export default async function WorkersPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const organization = await prisma.organization.findFirst({
    where: {
      ownerId: profile.id,
    },
  });

  if (!organization) {
    return <p>Organization not found.</p>;
  }

  const workers = await prisma.organizationWorker.findMany({
    where: {
      organizationId: organization.id,
    },
    include: {
      worker: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const invites = await prisma.workerInvite.findMany({
    where: {
      organizationId: organization.id,
      accepted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-5xl p-8">

      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Workers
        </h1>

        <Link
          href="/organization/workers/invite"
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Invite Worker
        </Link>
      </div>

      {/* Pending Invitations */}

      <section className="mb-12">
        <h2 className="mb-5 text-2xl font-bold">
          Pending Invitations
        </h2>

        {invites.length === 0 ? (
          <p className="text-gray-500">
            No pending invitations.
          </p>
        ) : (
          <div className="space-y-4">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="rounded-xl border border-orange-200 bg-white p-6 shadow"
              >
                <h3 className="text-xl font-semibold">
                  {invite.fullName}
                </h3>

                <p className="mt-2 text-gray-600">
                  {invite.email}
                </p>

                <p className="mt-4 text-sm font-medium text-orange-600">
                  Status: Pending
                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <input
                    readOnly
                    value={`http://localhost:3000/invite/${invite.token}`}
                    className="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm"
                  />

                  <CopyInviteButton token={invite.token} />


                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Workers */}

      <section>

        <h2 className="mb-5 text-2xl font-bold">
          Active Workers
        </h2>

        {workers.length === 0 ? (
          <p className="text-gray-500">
            No workers yet.
          </p>
        ) : (
          <div className="space-y-4">

            {workers.map(({ worker }) => (

              <div
                key={worker.id}
                className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold">
                  {worker.profile.fullName}
                </h3>

                <p className="mt-2 text-gray-600">
                  {worker.bio || "No bio yet."}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  {worker.profile.email}
                </p>

                <div className="mt-6 flex gap-3">

                  <Link
                    href={`/organization/workers/${worker.id}/edit`}
                    className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
                  >
                    Edit
                  </Link>

                  <button
                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </main>
  );
}





