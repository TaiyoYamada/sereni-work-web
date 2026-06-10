import type { Metadata } from "next";
import { Suspense } from "react";

import { CompaniesView } from "@/features/companies/components/companies-view";

export const metadata: Metadata = { title: "実習先企業" };

export default function CompaniesPage() {
  return (
    <Suspense>
      <CompaniesView />
    </Suspense>
  );
}
