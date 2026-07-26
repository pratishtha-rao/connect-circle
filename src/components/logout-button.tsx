"use client";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button
      onClick={logout}
      className="px-6 py-3 text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-orange-200"
    >
      Log Out
    </button>
  );
}