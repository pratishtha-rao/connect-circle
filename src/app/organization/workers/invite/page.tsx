import InviteWorkerForm from "./invite-worker-form";
import OrganizationNavbar from "@/components/organization-navbar";

export default function InviteWorkerPage() {
  return (
    <> <OrganizationNavbar/>
    <main className="mx-auto max-w-2xl p-8">

      <h1 className="mb-3 text-4xl font-bold">
        Invite Employee
      </h1>

      <p className="mb-8 text-gray-600">
        Invite an employee to join your organization.
      </p>

      <InviteWorkerForm />
    </main>
    </>
  );
}

