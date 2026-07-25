"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

type Profile = {
  fullName: string;
  email: string;
  phone: string | null;
};

type Props = {
  profile: Profile;
};

type FormValues = {
  fullName: string;
  phone: string;
};

export default function ProfileForm({
  profile,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: {
      isSubmitting,
      errors,
    },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: profile.fullName ?? "",
      phone: profile.phone ?? "",
    },
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  async function onSubmit(data: FormValues) {
    const res = await fetch("/api/customer/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error ?? "Failed to save profile.");
      return;
    }

    alert("Profile updated successfully.");

    window.location.reload();
  }

  async function changePassword() {
  if (!password.trim()) {
    alert("Please enter a password.");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  setChangingPassword(true);

  const res = await fetch("/api/customer/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newPassword: password.trim(),
    }),
  });

  const json = await res.json();

  setChangingPassword(false);

  if (!res.ok) {
    alert(json.error ?? "Unable to change password.");
    return;
  }

  alert("Password updated successfully.");

  setPassword("");
  setConfirmPassword("");
}

  return (
    <div className="space-y-8">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border bg-white p-8 shadow"
      >

        <h2 className="mb-6 text-2xl font-bold">
          Profile
        </h2>

        <div className="space-y-6">

          <div>

            <label className="mb-2 block font-semibold">
              Full Name
            </label>

            <input
              {...register("fullName", {
                required:
                  "Full name is required.",
              })}
              className="w-full rounded-lg border p-3"
            />

            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}

          </div>

<div>

  <label className="mb-2 block font-semibold">
    Email
  </label>

  <div className="w-full rounded-lg border bg-gray-50 px-3 py-3 text-gray-700">
    {profile.email}
  </div>

  <p className="mt-2 text-sm text-gray-500">
    Your email is used for signing in and currently cannot be changed.
  </p>

</div>

          <div>

            <label className="mb-2 block font-semibold">
              Phone
            </label>

            <input
              {...register("phone")}
              className="w-full rounded-lg border p-3"
            />

          </div>

        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : "Save Profile"}
        </button>

      </form>

      <div className="rounded-2xl border bg-white p-8 shadow">

        <h2 className="text-2xl font-bold">
          Account
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Manage your account security.
        </p>

        <div className="mt-8">

          <label className="mb-2 block font-semibold">
            New Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-lg border p-3"
            placeholder="Enter new password"
          />

        </div>

        <div className="mt-5">

          <label className="mb-2 block font-semibold">
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3"
            placeholder="Confirm new password"
          />

        </div>

        <button
          type="button"
          onClick={changePassword}
          disabled={changingPassword}
          className="mt-8 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {changingPassword
            ? "Updating..."
            : "Update Password"}
        </button>

      </div>

    </div>
  );
}