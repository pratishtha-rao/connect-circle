import { getCurrentProfile } from "@/lib/profile";
import { notFound } from "next/navigation";
import WorkerNavbar from "@/components/worker-navbar";

import ChangePasswordForm from "./change-password-form";

export default async function ChangeWorkerPasswordPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">

      <WorkerNavbar />

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-900">
          Change Password
        </h1>

        <p className="mt-2 text-gray-600">
          Choose a strong password to keep your account secure.
        </p>

      </div>

      <ChangePasswordForm />

    </main>
  );
}