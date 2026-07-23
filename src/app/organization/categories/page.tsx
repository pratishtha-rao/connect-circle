import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";

export default async function CategoriesPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return <p>Unauthorized.</p>;
  }

  const organization = await prisma.organization.findFirst({
    where: {
      ownerId: profile.id,
    },
  });

  if (!organization) {
    return <p>No organization found.</p>;
  }

  const categories = await prisma.serviceCategory.findMany({
    where: {
      organizationId: organization.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Categories
        </h1>

        <Link
          href="/organization/categories/new"
          className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
        >
          New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">
          No categories yet.
        </p>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-orange-200 bg-white p-4"
            >
              <h2 className="font-semibold">
                {category.name}
              </h2>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}