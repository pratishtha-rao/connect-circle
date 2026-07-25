"use client";

import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SignupForm = {
  fullName: string;
  email: string;
  password: string;
  role: "USER" | "WORKER" | "ORG_ADMIN";
};

export default function SignupPage() {
  const supabase = createClient();

  const searchParams = useSearchParams();

  const redirect =
    searchParams.get("redirect") ?? "/dashboard";

  const {
    register,
    handleSubmit,
  } = useForm<SignupForm>({
    defaultValues: {
      role: "USER",
    },
  });

  async function onSubmit(data: SignupForm) {
    const { data: authData, error } =
      await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

    if (error) {
      alert(error.message);
      return;
    }

    if (!authData.user) {
      alert("Unable to create account.");
      return;
    }

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authId: authData.user.id,
        email: authData.user.email,
        fullName: data.fullName,
        role: data.role,
      }),
    });

    if (!response.ok) {
      const json = await response.json().catch(() => null);

      alert(json?.error ?? "Failed to create profile.");
      return;
    }

    window.location.href = redirect;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5 rounded-2xl border bg-card p-8 shadow"
      >
        <h1 className="text-3xl font-bold">
          Create Account
        </h1>

        <input
          {...register("fullName", {
            required: true,
          })}
          placeholder="Full Name"
          className="w-full rounded-lg border p-3"
        />

        <input
          {...register("email", {
            required: true,
          })}
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border p-3"
        />

        <input
          {...register("password", {
            required: true,
            minLength: 6,
          })}
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border p-3"
        />

        <div>
          <label className="mb-2 block font-semibold">
            I am a
          </label>

          <select
            {...register("role")}
            className="w-full rounded-lg border p-3"
          >
            <option value="USER">
              Customer
            </option>

            <option value="WORKER">
              Employee
            </option>

            <option value="ORG_ADMIN">
              Organization
            </option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-orange-500 p-3 font-semibold text-white hover:bg-orange-600"
        >
          Create Account
        </button>
      </form>
    </main>
  );
}
