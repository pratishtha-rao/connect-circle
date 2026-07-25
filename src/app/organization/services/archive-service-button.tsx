"use client";

export default function DeleteServiceButton({
  id,
}: {
  id: string;
}) {
  async function remove() {
    const confirmed = window.confirm(
      "Do you want to archive this service? Customers will no longer be able to book it, but existing bookings will be kept."
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
      className="rounded-lg border-2 border-red-0 bg-red-500 px-5 py-2 font-arial text-white shadow hover:bg-red-700 hover:border-red-0 transition"
    >
      Archive Service
    </button>
  );
}
