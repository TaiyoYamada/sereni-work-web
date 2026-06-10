import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { AssignmentForm } from "@/features/assignments/components/assignment-form";

export const metadata: Metadata = { title: "実習割当の作成" };

export default function NewAssignmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="実習割当の作成"
        description="下書きとして作成し、内容を確認してから確定します"
      />
      <AssignmentForm />
    </div>
  );
}
