import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/profile";
import DeleteCategoryButton from "./delete-category-button";
import OrganizationNavbar from "@/components/organization-navbar";

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
    <>
                <OrganizationNavbar />

    <main className="mx-auto max-w-4xl p-8">

<div className="mb-8 flex items-center gap-30">
  <h1 className="text-4xl font-bold">
    Categories
  </h1>

  <Link
    href="/organization/categories/new"
    className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
  >
    New Category
  </Link>
</div>
      {categories.length === 0 ? (
        <p mt-6 className="text-blue-200">
          No categories yet.
        </p>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="mt-10 rounded-xl border-blue-200 bg-blue-200 p-4"
            >
              <h2 className="text-xl font-semibold">
                {category.name}
              </h2>

            <DeleteCategoryButton id={category.id} />

            </div>
            
          ))}

        </div>
      )}
    </main>
    </>
  );
}