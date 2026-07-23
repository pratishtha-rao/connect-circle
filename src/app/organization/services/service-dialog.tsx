"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddServiceButton() {
  return (
    <Link href="/organization/services/new">
      <Button className="bg-orange-500 hover:bg-orange-600">
        + Add Service
      </Button>
    </Link>
  );
}