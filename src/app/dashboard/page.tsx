import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  switch (profile.role) {
case "SUPER_ADMIN": {
  const organization = await prisma.organization.findFirst({
    where: {
      ownerId: profile.id,
    },
  });

  if (!organization) {
    redirect("/organization/onboarding");
  }

  redirect("/organization");
}

case "ORG_ADMIN": {
  const organization = await prisma.organization.findUnique({
    where: {
      ownerId: profile.id,
    },
  });

  if (!organization) {
    redirect("/organization/onboarding");
  }

  redirect("/organization");
}

    case "WORKER":
    case "INDEPENDENT_WORKER":
      redirect("/worker/onboarding");

    case "USER":
    default:
      redirect("/customer/onboarding");
  }
}