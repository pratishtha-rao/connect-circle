import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function OrganizationPage({
  params,
}: Props) {
  const { organizationId } = await params;

const organization = await prisma.organization.findUnique({
  where: {
    id: organizationId,
  },
  include: {
    categories: {
      orderBy: {
        name: "asc",
      },
    },

    services: {
  where: {
    archived: false,
  },

  include: {
    category: true,
  },

  orderBy: {
    title: "asc",
  },
},

},
});
  if (!organization) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl p-8">

      {/* Organization */}

      <section className="mb-12 text-center">

        <h1 className="text-5xl font-bold">
          {organization.name}
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
          {organization.description ||
            "No description available."}
        </p>

        {organization.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {organization.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-8 text-gray-700">

          {organization.address && (
            <div>
             <b> Address: </b> {organization.address}
            </div>
          )}

          {organization.phone && (
            <div>
              <b> Phone: </b>{organization.phone}
            </div>
          )}

          {organization.website && (
            <div>
              {" "}
              <a
                href={
                  organization.website.startsWith("http")
                    ? organization.website
                    : `https://${organization.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-orange-600 hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}

          {organization.timezone && (
            <div>
              <b> Timezone: </b> {organization.timezone}
            </div>
          )}

        </div>

      </section>

      {/* Booking Info */}

      <section className="mb-12 rounded-2xl border bg-orange-50 p-8">

        <h2 className="text-2xl font-bold">
          Booking Information
        </h2>

        <p className="mt-4 text-gray-700">
          Once you submit a booking request, the organization
          will review it and update its status in your Customer
          Dashboard.
        </p>

        <p className="mt-4 text-gray-700">
          Please follow any payment instructions provided by the
          organization before expecting confirmation.
        </p>

        <p className="mt-4 text-gray-700">
          Additional booking requirements and instructions will
          appear during the booking process.
        </p>

      </section>

      {/* Services */}

      <section>

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold">
              Choose a Service
            </h2>

            <p className="mt-2 text-gray-600">
              Browse all services offered by this organization.
            </p>

          </div>

          <Link
            href={`/customer/organizations/${organization.id}/services`}
            className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            View All Services ({organization.services.length})
          </Link>

        </div>

      </section>

    </main>
  );
}
