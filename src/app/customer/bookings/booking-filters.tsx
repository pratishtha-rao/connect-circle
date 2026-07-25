"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type Organization = {
  id: string;
  name: string;
};

type Worker = {
  id: string;
  profile: {
    fullName: string;
  };
};

type Props = {
  organizations: Organization[];
  workers: Worker[];
};

export default function BookingFilters({
  organizations,
  workers,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(
    key: string,
    value: string
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  function submitSearch() {
    const input = document.getElementById(
      "booking-search"
    ) as HTMLInputElement;

    updateParam("search", input.value);
  }

  const currentYear = new Date().getFullYear();

  const years = [];

  for (
    let year = currentYear;
    year >= currentYear - 5;
    year--
  ) {
    years.push(year);
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="grid gap-4 lg:grid-cols-5">

        <div className="flex gap-2 lg:col-span-2">

          <input
            id="booking-search"
            defaultValue={
              searchParams.get("search") ?? ""
            }
            placeholder="Search services, organizations or workers..."
            className="flex-1 rounded-xl border p-3"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitSearch();
              }
            }}
          />

          <button
            type="button"
            onClick={submitSearch}
            className="rounded-xl bg-orange-500 px-5 font-semibold text-white transition hover:bg-orange-600"
          >
            Search
          </button>

        </div>

        <select
          defaultValue={
            searchParams.get("organization") ??
            ""
          }
          onChange={(e) =>
            updateParam(
              "organization",
              e.target.value
            )
          }
          className="rounded-xl border p-3"
        >
          <option value="">
            All Organizations
          </option>

          {organizations.map((organization) => (
            <option
              key={organization.id}
              value={organization.id}
            >
              {organization.name}
            </option>
          ))}
        </select>

        <select
          defaultValue={
            searchParams.get("worker") ?? ""
          }
          onChange={(e) =>
            updateParam(
              "worker",
              e.target.value
            )
          }
          className="rounded-xl border p-3"
        >
          <option value="">
            All Workers
          </option>

          {workers.map((worker) => (
            <option
              key={worker.id}
              value={worker.id}
            >
              {worker.profile.fullName}
            </option>
          ))}
        </select>

      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

        <div className="flex flex-wrap gap-2">

          {[
            "ALL",
            "PENDING",
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED",
          ].map((status) => {
            const active =
              (searchParams.get("status") ??
                "ALL") === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() =>
                  updateParam(
                    "status",
                    status
                  )
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-orange-500 text-white"
                    : "border bg-white hover:bg-gray-50"
                }`}
              >
                {status === "ALL"
                  ? "All Statuses"
                  : status
                      .replace(
                        "_",
                        " "
                      )
                      .toLowerCase()
                      .replace(
                        /\b\w/g,
                        (c) =>
                          c.toUpperCase()
                      )}
              </button>
            );
          })}

        </div>

        <button
          type="button"
          onClick={() =>
            router.push(pathname)
          }
          className="rounded-xl border px-5 py-2 font-medium transition hover:bg-gray-50"
        >
          Clear Filters
        </button>

      </div>

    </div>
  );
}
