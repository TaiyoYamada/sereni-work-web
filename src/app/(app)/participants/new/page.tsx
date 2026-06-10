import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { ParticipantForm } from "@/features/participants/components/participant-form";

export const metadata: Metadata = { title: "利用者の登録" };

export default function NewParticipantPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="利用者の登録" />
      <ParticipantForm />
    </div>
  );
}
