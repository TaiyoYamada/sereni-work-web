import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { OptimizationForm } from "@/features/optimization/components/optimization-form";

export const metadata: Metadata = { title: "自動提案の実行" };

export default function NewOptimizationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="自動提案の実行"
        description="対象と重視する条件を選んで、割当候補を生成します"
      />
      <OptimizationForm />
    </div>
  );
}
