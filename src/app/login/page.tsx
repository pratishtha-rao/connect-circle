"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const supabase = createClient();

  const searchParams = useSearchParams();

  const redirect =
    searchParams.get("redirect") ?? "/dashboard";

  const {
    register,
    handleSubmit,
  } = useForm<LoginForm>();

async function onSubmit(data: LoginForm) {
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login")) {
      alert("Incorrect email or password.");
    } else {
      alert(error.message);
    }

    return;
  }

  window.location.href = redirect;
}

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 rounded-xl border p-6"
      >
        <h1 className="text-3xl font-bold">
          Login
        </h1>

        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="w-full rounded border p-3"
        />

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full rounded border p-3"
        />

        <button
          type="submit"
          className="w-full rounded bg-black p-3 text-white"
        >
          Login
        </button>
      </form>
    </main>
  );
}
