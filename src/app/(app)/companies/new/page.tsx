import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { CompanyForm } from "@/features/companies/components/company-form";

export const metadata: Metadata = { title: "実習先企業の登録" };

export default function NewCompanyPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="実習先企業の登録" />
      <CompanyForm />
    </div>
  );
}
