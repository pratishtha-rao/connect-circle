import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import CopyInviteButton from "./copy-invite-button";
import RemoveWorkerButton from "./remove-worker-button";
import OrganizationNavbar from "@/components/organization-navbar";

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
    <>       <OrganizationNavbar />

    <main className="mx-auto max-w-5xl p-8">

      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Employees
        </h1>

        <Link
          href="/organization/workers/invite"
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Invite Employees
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
                className="rounded-xl border border-blue-200 bg-blue-200 p-6 shadow"
              >
                <h3 className="text-xl font-semibold">
                  {invite.fullName}
                </h3>

                <p className="mt-2 text-black">
                  {invite.email}
                </p>

                <p className="mt-4 text-md font-semibold text-black">
                  Status:
                </p>

                <p className="text-md font-semibold text-orange-600">
                    Pending 
                    </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <input
                    readOnly
                    value={`http://localhost:3000/invite/${invite.token}`}
                    className="flex-1 rounded-lg border border-black-300 bg-violet-100 p-2 text-sm"
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
          Active Employees
        </h2>

        {workers.length === 0 ? (
          <p className="text-gray-500">
            No employees yet.
          </p>
        ) : (
          <div className="space-y-4">

            {workers.map(({ worker }) => (

              <div
                key={worker.id}
                className="rounded-xl border border-blue-200 bg-blue-200 p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold">
                  {worker.profile.fullName}
                </h3>

                <p className="mt-2 text-black">
                  Bio: {worker.bio || "No bio yet."}
                </p>

                <p className="mt-3 text-sm text-black">
                  Email: {worker.profile.email}
                </p>

<div className="mt-6 flex gap-3">

  <Link
    href={`/organization/workers/${worker.id}/availability`}
    className="rounded-lg bg-orange-400 px-4 py-2 font-timesnewroman text-white hover:bg-orange-500"
  >
    Availability
  </Link>

  <Link
    href={`/organization/workers/${worker.id}/services`}
    className="rounded-lg bg-green-400 px-4 py-2 font-timesnewroman text-white hover:bg-green-500"
  >
    Services
  </Link>

<RemoveWorkerButton workerId={worker.id} />

</div>

              </div>

            ))}

          </div>
        )}

      </section>

    </main>
     </>
  );
}





