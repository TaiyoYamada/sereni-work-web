import type { Metadata } from "next";
import { Suspense } from "react";

import { ParticipantsView } from "@/features/participants/components/participants-view";

export const metadata: Metadata = { title: "利用者" };

export default function ParticipantsPage() {
  return (
    <Suspense>
      <ParticipantsView />
    </Suspense>
  );
}
