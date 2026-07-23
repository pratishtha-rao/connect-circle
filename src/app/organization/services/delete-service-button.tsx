"use client";

export default function DeleteServiceButton({
  id,
}: {
  id: string;
}) {
  async function remove() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) {
      return;
    }

    const res = await fetch(`/api/services/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete service.");
      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={remove}
      className="rounded-lg border-2 border-red-600 bg-red-600 px-5 py-2 font-semibold text-white shadow hover:bg-red-700 hover:border-red-700 transition"
    >
      Delete Service
    </button>
  );
}
