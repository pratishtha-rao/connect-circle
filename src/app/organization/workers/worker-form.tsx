"use client";

import { useState } from "react";

export default function WorkerForm() {
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);

    try {
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          bio: formData.get("bio"),
          languages: formData.get("languages"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Failed to create worker.");
        setLoading(false);
        return;
      }

      window.location.href = "/organization/workers";
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
        name="fullName"
        required
        placeholder="Full name"
        className="w-full rounded-xl border border-orange-200 p-3"
      />

      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="w-full rounded-xl border border-orange-200 p-3"
      />

      <textarea
        name="bio"
        placeholder="Bio"
        className="w-full rounded-xl border border-orange-200 p-3"
      />

      <input
        name="languages"
        placeholder="Languages (comma separated)"
        className="w-full rounded-xl border border-orange-200 p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Create Worker"}
      </button>
    </form>
  );
}