import WorkerForm from "../worker-form";

export default function NewWorkerPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-4xl font-bold">
        New Worker
      </h1>

      <WorkerForm />
    </main>
  );
}