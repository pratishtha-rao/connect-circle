import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth";

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  console.log("Supabase user:", user?.id);

  if (!user) {
    return null;
  }

  const byAuthId = await prisma.profile.findUnique({
    where: {
      authId: user.id,
    },
  });

  console.log("Profile by authId:", byAuthId);

  return byAuthId;
}