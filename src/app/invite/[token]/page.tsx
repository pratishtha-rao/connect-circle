import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import AcceptInvitationButton from "./accept-invitation-button";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function InvitePage({ params }: Props) {
  const { token } = await params;

  const invite = await prisma.workerInvite.findUnique({
    where: {
      token,
    },
    include: {
      organization: true,
    },
  });

  if (
    !invite ||
    invite.accepted ||
    invite.expiresAt < new Date()
  ) {
    notFound();
  }

  const profile = await getCurrentProfile();

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-8">
      <div className="w-full rounded-2xl border border-orange-200 bg-white p-8 shadow">

        <h1 className="mb-3 text-3xl font-bold">
          You're Invited!
        </h1>

        <p className="text-gray-600">
          <strong>{invite.organization.name}</strong> has invited you to join
          their organization.
        </p>

        <div className="mt-8 rounded-xl bg-orange-50 p-5">
          <p>
            <strong>Name</strong>
          </p>

          <p className="mb-4">
            {invite.fullName}
          </p>

          <p>
            <strong>Email</strong>
          </p>

          <p>
            {invite.email}
          </p>
        </div>

        <div className="mt-8">

          {!profile ? (
            <div className="space-y-3">

              <Link
                href={`/login?redirect=/invite/${token}`}
                className="block rounded-xl bg-orange-500 px-6 py-3 text-center font-semibold text-white hover:bg-orange-600"
              >
                Log In
              </Link>

              <Link
                href={`/signup?redirect=/invite/${token}`}
                className="block rounded-xl border border-orange-500 px-6 py-3 text-center font-semibold text-orange-600 hover:bg-orange-50"
              >
                Create Account
              </Link>

            </div>
          ) : (
            <AcceptInvitationButton token={token} />
          )}

        </div>
      </div>
    </main>
  );
}
