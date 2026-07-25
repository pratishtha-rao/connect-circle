import { getCurrentProfile } from "@/lib/profile";
import { notFound } from "next/navigation";
import ChangeEmailForm from "./change-email-form";

export default async function ChangeWorkerEmailPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-900">
          Change Email
        </h1>

        <p className="mt-2 text-gray-600">
          Update the email used to sign in to your Connect Circle account.
          After submitting, Supabase will send a verification email to your
          new address.
        </p>

      </div>

<ChangeEmailForm />

    </main>
  );
}