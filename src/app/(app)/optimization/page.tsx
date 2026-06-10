import type { Metadata } from "next";
import { Suspense } from "react";

import { RunsView } from "@/features/optimization/components/runs-view";

export const metadata: Metadata = { title: "割当の自動提案" };

export default function OptimizationPage() {
  return (
    <Suspense>
      <RunsView />
    </Suspense>
  );
}
