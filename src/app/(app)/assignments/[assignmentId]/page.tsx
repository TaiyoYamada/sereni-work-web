import type { Metadata } from "next";

import { AssignmentDetail } from "@/features/assignments/components/assignment-detail";

export const metadata: Metadata = { title: "実習割当詳細" };

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  return <AssignmentDetail assignmentId={assignmentId} />;
}
