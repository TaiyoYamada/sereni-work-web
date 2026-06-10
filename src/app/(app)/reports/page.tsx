import type { Metadata } from "next";
import { Suspense } from "react";

import { ReportsView } from "@/features/reports/components/reports-view";

export const metadata: Metadata = { title: "日報" };

export default function ReportsPage() {
  return (
    <Suspense>
      <ReportsView />
    </Suspense>
  );
}
