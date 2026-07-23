export default function OrganizationPage() {
  return (
    <main>
      <h1 className="text-4xl font-bold text-gray-900">
        Organization Dashboard
      </h1>

      <p className="mt-2 text-gray-700">
        Manage your organization.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Services
          </h2>

          <p className="mt-2 text-gray-700">
            Manage all services.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Workers
          </h2>

          <p className="mt-2 text-gray-700">
            Manage workers.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Categories
          </h2>

          <p className="mt-2 text-gray-700">
            Organize services.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Settings
          </h2>

          <p className="mt-2 text-gray-700">
            Organization information.
          </p>
        </div>
      </div>
    </main>
  );
}