import CategoryForm from "../category-form";

export default function NewCategoryPage() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-8 text-4xl font-bold">
        New Category
      </h1>

      <CategoryForm />
    </main>
  );
}