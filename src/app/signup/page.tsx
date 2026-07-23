"use client";

import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";

type SignupForm = {
  fullName: string;
  email: string;
  password: string;
  role: "USER" | "WORKER" | "INDEPENDENT_WORKER" | "ORG_ADMIN";
};

export default function SignupPage() {
  const supabase = createClient();

  const {
    register,
    handleSubmit,
  } = useForm<SignupForm>({
    defaultValues: {
      role: "USER",
    },
  });

  async function onSubmit(data: SignupForm) {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: data.role,
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

    if (!authData.session && !authData.user.identities?.length) {
      alert("An account with this email already exists.");
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
      alert("Failed to create profile.");
      return;
    }

window.location.href = "/dashboard";
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
          {...register("fullName", { required: true })}
          placeholder="Full Name"
          className="w-full rounded-lg border p-3"
        />

        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border p-3"
        />

        <input
          {...register("password", { required: true, minLength: 6 })}
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border p-3"
        />

        <select
          {...register("role")}
          className="w-full rounded-lg border p-3"
        >
          <option value="USER">Customer</option>
          <option value="ORG_ADMIN">Organization</option>
          <option value="WORKER">Organization Worker</option>
          <option value="INDEPENDENT_WORKER">
            Independent Worker
          </option>
        </select>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary p-3 text-primary-foreground"
        >
          Create Account
        </button>
      </form>
    </main>
  );
}