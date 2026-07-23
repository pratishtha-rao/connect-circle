import InviteWorkerForm from "./invite-worker-form";

export default function InviteWorkerPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-3 text-4xl font-bold">
        Invite Worker
      </h1>

      <p className="mb-8 text-gray-600">
        Invite a worker to join your organization.
      </p>

      <InviteWorkerForm />
    </main>
  );
}

