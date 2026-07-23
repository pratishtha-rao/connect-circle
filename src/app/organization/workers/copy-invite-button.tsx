"use client";

import { useState } from "react";

type CopyInviteButtonProps = {
  token: string;
};

export default function CopyInviteButton({
  token,
}: CopyInviteButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = `${window.location.origin}/invite/${token}`;

    try {
      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Failed to copy invitation link.");
    }
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
