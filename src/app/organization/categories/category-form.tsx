"use client";

import { useState } from "react";

export default function CategoryForm() {
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
        }),
      });

      const text = await res.text();

      let data: any = {};

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Raw response:", text);
      }

      if (!res.ok) {
        alert(data.error ?? text);
        setLoading(false);
        return;
      }

      window.location.href = "/organization/categories";
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong.");
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
        name="name"
        required
        placeholder="Category name"
        className="w-full rounded-xl border border-orange-200 p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600"
      >
        {loading ? "Saving..." : "Create Category"}
      </button>
    </form>
  );
}