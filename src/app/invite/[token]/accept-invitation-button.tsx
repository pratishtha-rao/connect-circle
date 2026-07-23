"use client";

import { useState } from "react";

type Props = {
  token: string;
};

export default function AcceptInvitationButton({
  token,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function acceptInvitation() {
    setLoading(true);

    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Failed to accept invitation.");

        if (res.status === 401) {
          window.location.href =
            `/login?redirect=/invite/${token}`;
        }

        setLoading(false);
        return;
      }

      window.location.href = "/worker";
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={acceptInvitation}
      disabled={loading}
      className="w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading
        ? "Accepting..."
        : "Accept Invitation"}
    </button>
  );
}