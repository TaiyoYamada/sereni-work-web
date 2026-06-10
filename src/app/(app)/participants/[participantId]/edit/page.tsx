"use client";

import { use } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useParticipant } from "@/features/participants/api/get-participant";
import { ParticipantForm } from "@/features/participants/components/participant-form";

export default function EditParticipantPage({
  params,
}: {
  params: Promise<{ participantId: string }>;
}) {
  const { participantId } = use(params);
  const { data: participant, isPending } = useParticipant(participantId);

  return (
    <div className="space-y-6">
      <PageHeader title="利用者情報の編集" />
      {isPending ? (
        <Skeleton className="h-96 w-full max-w-2xl" />
      ) : participant ? (
        <ParticipantForm participant={participant} />
      ) : null}
    </div>
  );
}
