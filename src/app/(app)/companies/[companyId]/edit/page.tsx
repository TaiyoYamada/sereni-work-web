"use client";

import { use } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompany } from "@/features/companies/api/get-company";
import { CompanyForm } from "@/features/companies/components/company-form";

export default function EditCompanyPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = use(params);
  const { data: company, isPending } = useCompany(companyId);

  return (
    <div className="space-y-6">
      <PageHeader title="企業情報の編集" />
      {isPending ? (
        <Skeleton className="h-96 w-full max-w-2xl" />
      ) : company ? (
        <CompanyForm company={company} />
      ) : null}
    </div>
  );
}
