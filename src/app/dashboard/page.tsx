import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
const profile = await getCurrentProfile();

if (!profile) {
  redirect("/login");
}

if (
  !profile.onboardingComplete &&
  profile.role !== "SUPER_ADMIN"
) {
  redirect("/onboarding");
}

switch (profile.role) {
    case "SUPER_ADMIN":
    redirect("/organization/onboarding?force=true");

  case "ORG_ADMIN":
    redirect("/organization");

  case "WORKER":
    redirect("/worker");

  case "USER":
  default:
    redirect("/customer");
}}

