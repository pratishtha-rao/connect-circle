"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordForm() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function updatePassword() {
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully.");
    window.history.back();
  }

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm space-y-6">
      <div>
        <label className="mb-2 block font-semibold">
          New Password
        </label>

        <input
          type="password"
          className="w-full rounded-lg border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Confirm Password
        </label>

        <input
          type="password"
          className="w-full rounded-lg border p-3"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        onClick={updatePassword}
        disabled={saving}
        className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
}