import type { Metadata } from "next";

import { ReportDetail } from "@/features/reports/components/report-detail";

export const metadata: Metadata = { title: "日報詳細" };

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  return <ReportDetail reportId={reportId} />;
}
