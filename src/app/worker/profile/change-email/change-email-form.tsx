"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChangeEmailForm() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  async function updateEmail() {
    if (!email) {
      alert("Enter an email.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      email,
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Confirmation email sent. Please verify your new email before it changes."
    );

    window.history.back();
  }

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm space-y-6">
      <div>
        <label className="mb-2 block font-semibold">
          New Email Address
        </label>

        <input
          type="email"
          className="w-full rounded-lg border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        onClick={updateEmail}
        disabled={saving}
className="w-full rounded-lg bg-orange-500 px-6 py-3 text-center font-semibold text-white hover:bg-orange-600 disabled:opacity-50"      >
        {saving ? "Updating..." : "Update Email"}
      </button>
    </div>
  );
}