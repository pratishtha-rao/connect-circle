"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Organization = {
  id: string;
  name: string;
  description: string | null;
  logo: string |null;
  address: string | null;
  phone: string | null;
  website: string | null;
  timezone: string | null;
  tags: string[];
};

type Props = {
  organizations: Organization[];
};

export default function OrganizationSearch({
  organizations,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return organizations.filter((org) => {
      return (
        org.name.toLowerCase().includes(query) ||
        org.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        )
      );
    });
  }, [organizations, search]);

  return (
    <>
      <input
        placeholder="Search organization or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 w-full rounded-xl border p-4"
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((organization) => (
          <div
            key={organization.id}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-2xl font-bold">
              {organization.name}
            </h2>

            <p className="mt-2 text-gray-600">
              {organization.description ??
                "No description available."}
            </p>

            {/* Categories */}

            {organization.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {organization.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Organization Details */}

            <div className="mt-5 space-y-2 text-sm text-gray-600">

              {organization.address && (
                <p>
                  <strong>Address:</strong>{" "}
                  {organization.address}
                </p>
              )}

              {organization.phone && (
                <p>
                  <strong>Phone:</strong>{" "}
                  {organization.phone}
                </p>
              )}

{organization.website && (
  <p>
    <strong>Website:</strong>{" "}
    <a
      href={
        organization.website.startsWith("http")
          ? organization.website
          : `https://${organization.website}`
      }
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-orange-600 hover:underline"
    >
      Visit Website
    </a>
  </p>
)}

              {organization.timezone && (
                <p>
                  <strong>Time Zone:</strong>{" "}
                  {organization.timezone}
                </p>
              )}

            </div>

            <Link
              href={`/customer/organizations/${organization.id}`}
              className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
            >
              View Organization
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
