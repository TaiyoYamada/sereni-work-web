import type { Metadata } from "next";
import { Suspense } from "react";

import { StaffView } from "@/features/staff/components/staff-view";

export const metadata: Metadata = { title: "職員" };

export default function StaffPage() {
  return (
    <Suspense>
      <StaffView />
    </Suspense>
  );
}
