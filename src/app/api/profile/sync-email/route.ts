import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  await prisma.profile.update({
    where: {
      authId: user.id,
    },
    data: {
      email: user.email!,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
