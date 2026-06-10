import type { Metadata } from "next";

import { RunDetail } from "@/features/optimization/components/run-detail";

export const metadata: Metadata = { title: "自動提案の結果" };

export default async function OptimizationRunPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  return <RunDetail runId={runId} />;
}
