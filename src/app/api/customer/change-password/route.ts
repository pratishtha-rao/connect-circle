import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  console.log("=== CHANGE PASSWORD ROUTE HIT ===");

  const body = await req.json();

  console.log("BODY:");
  console.log(body);

  const newPassword = body.newPassword;

  if (typeof newPassword !== "string") {
    return NextResponse.json(
      {
        error: "No password was received by the server.",
      },
      { status: 400 }
    );
  }

  if (newPassword.trim() === "") {
    return NextResponse.json(
      {
        error: "Password cannot be empty.",
      },
      { status: 400 }
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      {
        error: "Password must be at least 8 characters.",
      },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json({
    success: true,
  });
}
