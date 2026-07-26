import { notFound } from "next/navigation";

import { getCurrentProfile } from "@/lib/profile";
import ChangeEmailForm from "./change-email-form";
import OrganizationNavbar from "@/components/organization-navbar";

export default async function ChangeOrganizationEmailPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <OrganizationNavbar />

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-900">
          Change Login Email
        </h1>

        <p className="mt-2 text-gray-600">
          Update the email you use to sign into your organization account.
        </p>

      </div>

<ChangeEmailForm />
    </main>
  );
}