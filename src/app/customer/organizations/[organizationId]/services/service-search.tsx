"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Service = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration: number;

  categoryId: string | null;

  category: {
    id: string;
    name: string;
  } | null;
};

type Category = {
  id: string;
  name: string;
};

type Props = {
  organizationId: string;
  services: Service[];
    categories: Category[];
};

export default function ServiceSearch({
  organizationId,
  services,
  categories,
}: Props) {
  const [search, setSearch] = useState("");
const [selectedCategory, setSelectedCategory] =
  useState("all");

const filtered = useMemo(() => {
  return services.filter((service) => {
    const matchesSearch =
      service.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      service.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });
}, [services, search, selectedCategory]);

  return (
    <>

<div className="mb-8 flex flex-col">

  <input
    placeholder="Search services..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full rounded-xl border p-4"
  />

  <div className="mt-6">

    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
      Categories
    </h2>

    <div className="flex flex-wrap gap-3">

      <button
        onClick={() => setSelectedCategory("all")}
        className={`rounded-full px-4 py-2 ${
          selectedCategory === "all"
            ? "bg-orange-500 text-white"
            : "border"
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`rounded-full px-4 py-2 ${
            selectedCategory === category.id
              ? "bg-orange-500 text-white"
              : "border"
          }`}
        >
          {category.name}
        </button>
      ))}

    </div>

  </div>
    
</div>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {filtered.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border bg-blue-100 p-6 shadow-sm"
          >
            <h2 className="text-2xl font-bold">
              {service.title}
            </h2>


{service.category && (
  <div className="mt-2">
    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-gray-700">
      {service.category.name}
    </span>
  </div>
)}
            <p className="mt-3 text-gray-600">
              {service.description ??
                "No description available."}
            </p>

            <div className="mt-5 space-y-1 text-sm">

              <p>
                <strong>Price:</strong> ${service.price}
              </p>

              <p>
                <strong>Duration:</strong> {service.duration} minutes
              </p>

            </div>

            <Link
              href={`/customer/organizations/${organizationId}/services/${service.id}`}
              className="mt-6 inline-block rounded-lg bg-orange-400 px-5 py-3 font-timesnewroman text-white hover:bg-orange-600"
            >
              View Service
            </Link>

          </div>
        ))}

      </div>
    </>
  );
}