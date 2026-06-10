import type { Metadata } from "next";
import { Suspense } from "react";

import { AssignmentsView } from "@/features/assignments/components/assignments-view";

export const metadata: Metadata = { title: "実習割当" };

export default function AssignmentsPage() {
  return (
    <Suspense>
      <AssignmentsView />
    </Suspense>
  );
}
