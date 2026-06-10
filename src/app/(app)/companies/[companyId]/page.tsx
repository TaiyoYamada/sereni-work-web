import type { Metadata } from "next";

import { CompanyDetail } from "@/features/companies/components/company-detail";

export const metadata: Metadata = { title: "企業詳細" };

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  return <CompanyDetail companyId={companyId} />;
}
