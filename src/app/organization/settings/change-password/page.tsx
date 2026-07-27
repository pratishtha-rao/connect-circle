import { notFound } from "next/navigation";

import { getCurrentProfile } from "@/lib/profile";
import ChangePasswordForm from "./change-password-form";
import OrganizationNavbar from "@/components/organization-navbar";

export default async function ChangeOrganizationPasswordPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  return (
    <>       <OrganizationNavbar />
    <main className="mx-auto max-w-2xl p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-900">
          Change Password
        </h1>

        <p className="mt-2 text-gray-600">
          Update the password used to sign into your organization account.
        </p>

      </div>

      <ChangePasswordForm />

    </main>
    </>
  );
}