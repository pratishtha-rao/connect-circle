"use client";

import { useState } from "react";

type Category = {
  id: string;
  name: string;
};

type Service = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration: number;
  categoryId: string | null;
};

type ServiceFormProps = {
  categories: Category[];
  service?: Service;
};

export default function ServiceForm({
  categories,
  service,
}: ServiceFormProps) {
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);

    try {
      const editing = !!service;

      const res = await fetch(
        editing
          ? `/api/services/${service.id}`
          : "/api/services",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.get("title"),
            description: formData.get("description"),
            price: Number(formData.get("price")),
            duration: Number(formData.get("duration")),
            categoryId: formData.get("categoryId") || null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      window.location.href = "/organization/services";
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await submit(new FormData(e.currentTarget));
      }}
      className="space-y-5"
    >
      <input
        name="title"
        required
        defaultValue={service?.title ?? ""}
        placeholder="Service name"
        className="w-full rounded-xl border border-orange-200 p-3"
      />

      <textarea
        name="description"
        defaultValue={service?.description ?? ""}
        placeholder="Description"
        className="w-full rounded-xl border border-orange-200 p-3"
      />

      <select
        name="categoryId"
        defaultValue={service?.categoryId ?? ""}
        className="w-full rounded-xl border border-orange-200 p-3"
      >
        <option value="">No category</option>

        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>

      <input
        name="price"
        type="number"
        required
        min="0"
        step="0.01"
        defaultValue={service?.price ?? ""}
        placeholder="Price"
        className="w-full rounded-xl border border-orange-200 p-3"
      />

      <input
        name="duration"
        type="number"
        required
        min="1"
        defaultValue={service?.duration ?? ""}
        placeholder="Duration (minutes)"
        className="w-full rounded-xl border border-orange-200 p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : service
          ? "Update Service"
          : "Create Service"}
      </button>
    </form>
  );
}