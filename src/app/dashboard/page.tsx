import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  switch (profile.role) {
    case "SUPER_ADMIN":
      redirect("/organization/onboarding?force=true");

    case "ORG_ADMIN":
      if (!profile.onboardingComplete) {
        redirect("/organization/onboarding");
      }
      redirect("/organization");

    case "WORKER":
      if (!profile.onboardingComplete) {
        redirect("/worker");
      }
      redirect("/worker");

    case "USER":
    default:
      if (!profile.onboardingComplete) {
        redirect("/customer");
      }
      redirect("/customer");
  }
}