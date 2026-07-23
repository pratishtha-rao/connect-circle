"use client";

import { useForm } from "react-hook-form";

type Profile = {
  fullName: string;
  phone: string | null;
};

type Worker = {
  bio: string | null;
  languages: string | null;
};

type Props = {
  profile: Profile;
  worker: Worker;
};

type FormValues = {
  fullName: string;
  phone: string;
  bio: string;
  languages: string;
};

export default function ProfileForm({
  profile,
  worker,
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
      bio: worker.bio ?? "",
      languages: worker.languages ?? "",
    },
  });

  async function onSubmit(data: FormValues) {
    const res = await fetch("/api/workers/profile", {
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
window.location.href = "/worker";
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border bg-white p-8 shadow"
    >
      <div>
        <label className="mb-2 block font-semibold">
          Full Name
        </label>

        <input
          {...register("fullName", {
            required: "Full name is required.",
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
          Phone
        </label>

        <input
          {...register("phone")}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Bio
        </label>

        <textarea
          {...register("bio")}
          rows={5}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Languages
        </label>

        <input
          {...register("languages")}
          placeholder="English, Spanish..."
          className="w-full rounded-lg border p-3"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}