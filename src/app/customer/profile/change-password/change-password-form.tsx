"use client";

import { useForm } from "react-hook-form";

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>();

  async function onSubmit(data: FormValues) {
    console.log("CUSTOMER FORM SUBMITTED");
    console.log(data);

    if (data.newPassword !== data.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const res = await fetch("/api/customer/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword: data.newPassword,
      }),
    });

    const json = await res.json();

    console.log("API RESPONSE:", json);

    if (!res.ok) {
      alert(json.error ?? "Unable to change password.");
      return;
    }

    alert("Password changed successfully.");

    window.location.href = "/customer/profile";
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border bg-white p-8 shadow"
    >
      <div>
        <label className="mb-2 block font-semibold">
          New Password
        </label>

        <input
          type="password"
          {...register("newPassword", {
            required: "New password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters.",
            },
          })}
          className="w-full rounded-lg border p-3"
        />

        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Confirm Password
        </label>

        <input
          type="password"
          {...register("confirmPassword", {
            required: "Please confirm your password.",
          })}
          className="w-full rounded-lg border p-3"
        />

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {isSubmitting
          ? "Updating..."
          : "Change Password"}
      </button>
    </form>
  );
}