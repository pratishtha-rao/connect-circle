"use client";

export default function DeleteCategoryButton({
  id,
}: {
  id: string;
}) {
  async function removeCategory() {
    const ok = confirm(
      "Delete this category? All services will remain but become uncategorized."
    );

    if (!ok) return;

    const res = await fetch(
      `/api/categories/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      alert("Unable to delete category.");
      return;
    }

    location.reload();
  }

  return (
    <button
      onClick={removeCategory}
      className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
    >
      Delete
    </button>
  );
}