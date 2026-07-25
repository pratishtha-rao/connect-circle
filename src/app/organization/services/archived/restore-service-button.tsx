"use client";

export default function RestoreServiceButton({
  id,
}: {
  id: string;
}) {
  async function restore() {
    const confirmed = window.confirm(
      "Restore this service?"
    );

    if (!confirmed) {
      return;
    }

    const res = await fetch(
      `/api/services/${id}/restore`,
      {
        method: "PATCH",
      }
    );

    if (!res.ok) {
      const data = await res.json();

      alert(data.error ?? "Failed to restore service.");

      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={restore}
      className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
    >
      Restore
    </button>
  );
}