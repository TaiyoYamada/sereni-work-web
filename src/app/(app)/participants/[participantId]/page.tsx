import type { Metadata } from "next";

import { ParticipantDetail } from "@/features/participants/components/participant-detail";

export const metadata: Metadata = { title: "利用者詳細" };

export default async function ParticipantDetailPage({
  params,
}: {
  params: Promise<{ participantId: string }>;
}) {
  const { participantId } = await params;
  return <ParticipantDetail participantId={participantId} />;
}
