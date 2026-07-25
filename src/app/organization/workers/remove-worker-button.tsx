"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RemoveWorkerButton({
  workerId,
}: {
  workerId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function removeWorker() {
    if (
      !confirm(
        "Remove this worker from your organization?"
      )
    ) {
      return;
    }

    setLoading(true);

    const res = await fetch(
      `/api/organization/workers/${workerId}`,
      {
        method: "DELETE",
      }
    );

    setLoading(false);

    if (!res.ok) {
      alert("Unable to remove worker.");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={removeWorker}
      disabled={loading}
      className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Removing..." : "Remove"}
    </button>
  );
}