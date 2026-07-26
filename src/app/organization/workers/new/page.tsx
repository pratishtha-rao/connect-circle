import WorkerForm from "../worker-form";
import OrganizationNavbar from "@/components/organization-navbar";

export default function NewWorkerPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
            <OrganizationNavbar />

      <h1 className="mb-8 text-4xl font-bold">
        New Employee
      </h1>

      <WorkerForm />
    </main>
  );
}