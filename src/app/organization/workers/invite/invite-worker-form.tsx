"use client";

import { useState } from "react";

export default function InviteWorkerForm() {
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);

    try {
      const res = await fetch("/api/workers/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Failed to send invite.");
        setLoading(false);
        return;
      }

      alert("Invitation created!");

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
        placeholder="Worker name"
        className="w-full rounded-xl border border-orange-200 p-3"
      />

      <input
        name="email"
        type="email"
        required
        placeholder="Worker email"
        className="w-full rounded-xl border border-orange-200 p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Invitation"}
      </button>
    </form>
  );
}