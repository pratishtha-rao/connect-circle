
"use client";


import dynamic from "next/dynamic";
import type { ITimezoneOption } from "react-timezone-select";

import Link from "next/link";
import { useState } from "react";

type Props = {
  organization: {
    name: string;
    description: string | null;
    phone: string | null;
    address: string | null;
    website: string | null;
    logo: string | null;
    timezone: string | null;

bookingNotes: string | null;
paymentInstructions: string | null;

tags: string[];

allowWorkerSelection: boolean;

availabilityStartTime: string | null;
availabilityEndTime: string | null;
availabilityDays: number[];

    owner: {
      email: string;
    };
  };
};

export default function OrganizationSettingsForm({
  organization,
}: Props) {
  const [name, setName] = useState(organization.name);

  const [description, setDescription] = useState(
    organization.description ?? ""
  );

  const TimezoneSelect = dynamic(
  () => import("react-timezone-select"),
  {
    ssr: false,
  }
);


  const [phone, setPhone] = useState(
    organization.phone ?? ""
  );

  const [address, setAddress] = useState(
    organization.address ?? ""
  );

  const [website, setWebsite] = useState(
    organization.website ?? ""
  );

  const [logo, setLogo] = useState(
    organization.logo ?? ""
  );

const [timezone, setTimezone] = useState<ITimezoneOption>({
  value: organization.timezone ?? "",
  label: organization.timezone ?? "",
});

  const [bookingNotes, setBookingNotes] = useState(
    organization.bookingNotes ?? ""
  );

  const [paymentInstructions, setPaymentInstructions] =
    useState(
      organization.paymentInstructions ?? ""
    );

    const [tags, setTags] = useState<string[]>(
  organization.tags ?? []
);

const TIMEZONES = Intl.supportedValuesOf("timeZone");


const [allowWorkerSelection, setAllowWorkerSelection] =
  useState(
    organization.allowWorkerSelection
  );

const [availabilityStartTime, setAvailabilityStartTime] =
  useState(
    organization.availabilityStartTime ?? "09:00"
  );

const [availabilityEndTime, setAvailabilityEndTime] =
  useState(
    organization.availabilityEndTime ?? "17:00"
  );

const [availabilityDays, setAvailabilityDays] =
  useState<number[]>(
    organization.availabilityDays ?? [1,2,3,4,5]
  );

  const TAG_OPTIONS = [
  "Religious",
  "Beauty",
  "Health",
  "Wellness",
  "Fitness",
  "Education",
  "Professional",
  "Home Services",
  "Automotive",
  "Cleaning",
  "Child Care",
  "Pet Care",
  "Events",
  "Entertainment",
  "Photography",
  "Arts",
  "Recreation",
  "Food & Drink",
  "Retail",
  "Technology",
  "Travel",
  "Community",
  "Nonprofit",
  "Government",
  "Other",
];

  const [saving, setSaving] = useState(false);

  function toggleDay(day: number) {
  if (availabilityDays.includes(day)) {
    setAvailabilityDays(
      availabilityDays.filter((d) => d !== day)
    );
  } else {
    setAvailabilityDays([
      ...availabilityDays,
      day,
    ]);
  }
}


  async function save() {
    setSaving(true);

    const res = await fetch(
      "/api/organization/settings",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
body: JSON.stringify({
  name,
  description,
  phone,
  address,
  website,
  logo,
timezone: timezone.value,

  bookingNotes,
  paymentInstructions,

  tags,
  allowWorkerSelection,

  availabilityStartTime,
  availabilityEndTime,
  availabilityDays,
}),      }
    );

    setSaving(false);

if (!res.ok) {
  const error = await res.json();
  console.error(error);
  alert(error.error ?? JSON.stringify(error));
  return;
}

    alert("Settings updated.");
  }

  return (
    <div className="space-y-8">

      {/* Organization */}

      <section className="rounded-2xl border bg-white p-8 shadow-sm">

        <h2 className="text-2xl font-bold">
          Organization Information
        </h2>

        <p className="mt-2 text-gray-500">
          Update the public information customers see.
        </p>

        <div className="mt-8 space-y-6">

          <div>

            <label className="mb-2 block font-medium">
              Organization Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

<label className="mb-2 block font-medium">
  Time Zone
</label>

<TimezoneSelect
  value={timezone}
  onChange={setTimezone}
/>

<p className="mt-2 text-sm text-gray-500">
  Customers and workers will see appointment times in this organization's selected time zone.
</p>

<div className="space-y-3">

  <label className="block font-medium">
    Categories
  </label>

<div className="grid grid-cols-2 gap-2 md:grid-cols-3">

  {TAG_OPTIONS.map((tag) => (
    <label
      key={tag}
      className="flex items-center gap-2 rounded-lg border p-2 hover:bg-gray-50"
    >
      <input
        type="checkbox"
        checked={tags.includes(tag)}
        onChange={() => {
          if (tags.includes(tag)) {
            setTags(tags.filter((t) => t !== tag));
          } else {
            setTags([...tags, tag]);
          }
        }}
      />
      <span>{tag}</span>
    </label>
  ))}

<div>

  <label className="mb-2 block font-medium">
    Booking Options
  </label>

  <label className="flex items-center gap-3">

    <input
      type="checkbox"
      checked={allowWorkerSelection}
      onChange={(e) =>
        setAllowWorkerSelection(
          e.target.checked
        )
      }
    />

    <span>
      Allow customers to choose a worker
    </span>

  </label>

  <p className="mt-2 text-sm text-gray-500">
    If disabled, customers will simply choose an available appointment time and the organization can assign a worker later.
  </p>

</div>

{!allowWorkerSelection && (

  <div className="rounded-xl border bg-orange-50 p-5">

    <h3 className="text-lg font-semibold">
      Organization Availability
    </h3>

    <p className="mt-2 mb-5 text-sm text-gray-600">
      Customers will only be allowed to book during these days and times.
    </p>

    <div className="grid gap-6 md:grid-cols-2">

      <div>

        <label className="mb-2 block font-medium">
          Opening Time
        </label>

        <input
          type="time"
          value={availabilityStartTime}
          onChange={(e) =>
            setAvailabilityStartTime(e.target.value)
          }
          className="w-full rounded-lg border p-3"
        />

      </div>

      <div>

        <label className="mb-2 block font-medium">
          Closing Time
        </label>

        <input
          type="time"
          value={availabilityEndTime}
          onChange={(e) =>
            setAvailabilityEndTime(e.target.value)
          }
          className="w-full rounded-lg border p-3"
        />

      </div>

    </div>

    <div className="mt-6">

      <label className="mb-3 block font-medium">
        Available Days
      </label>

      <div className="flex flex-wrap gap-2">

        {[
          ["Mon",1],
          ["Tue",2],
          ["Wed",3],
          ["Thu",4],
          ["Fri",5],
          ["Sat",6],
          ["Sun",0],
        ].map(([label,value]) => (

          <button
            type="button"
            key={String(value)}
            onClick={() => toggleDay(Number(value))}
            className={`rounded-lg border px-4 py-2 transition ${
              availabilityDays.includes(Number(value))
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {label}
          </button>

        ))}

      </div>

    </div>

  </div>

)}

  </div>

</div>
          </div>

          <div>

            <label className="mb-2 block font-medium">
              Organization Booking Notes
            </label>

            <textarea
              rows={5}
              value={bookingNotes}
              onChange={(e) =>
                setBookingNotes(e.target.value)
              }
              placeholder="General booking information customers should know..."
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Payment Instructions
            </label>

            <textarea
              rows={5}
              value={paymentInstructions}
              onChange={(e) =>
                setPaymentInstructions(
                  e.target.value
                )
              }
              placeholder="Explain how customers should pay before confirmation..."
              className="w-full rounded-lg border p-3"
            />

          </div>

        </div>

        {/* Contact */}

        <div className="mt-8 space-y-6">

          <div>

            <label className="mb-2 block font-medium">
              Phone Number
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Website
            </label>

            <input
              value={website}
              onChange={(e) =>
                setWebsite(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Address
            </label>

            <input
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div className="flex justify-end">

            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </div>

      </section>

      {/* Account Security */}

      <section className="rounded-2xl border bg-white p-8 shadow-sm">

        <h2 className="text-2xl font-bold">
          Account Security
        </h2>

        <p className="mt-2 text-gray-500">
          Manage your login credentials.
        </p>

        <div className="mt-8">

          {/*
          <div className="flex items-center justify-between border-b py-5">

            <div>

              <p className="font-semibold">
                Login Email
              </p>

              <p className="mt-1 text-gray-500">
                {organization.owner.email}
              </p>

            </div>

            <Link
              href="/organization/settings/change-email"
              className="rounded-lg border px-4 py-3 text-center font-medium hover:bg-gray-50"
            >
              Change Email
            </Link>

          </div>
          */}

          <div className="flex items-center justify-between py-5">

            <div>

              <p className="font-semibold">
                Password
              </p>

              <p className="mt-1 text-gray-500">
                ••••••••••••••••
              </p>

            </div>

            <Link
              href="/organization/settings/change-password"
              className="rounded-lg border px-4 py-3 text-center font-medium hover:bg-gray-50"
            >
              Change Password
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}
