"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";
import { useMe } from "@/lib/auth";

import { useParticipant } from "../api/get-participant";
import { ParticipantAccountCard } from "./participant-account-card";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2">{children ?? "—"}</dd>
    </div>
  );
}

function BadgeList({ items }: { items: string[] }) {
  if (items.length === 0) return <>—</>;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => (
        <Badge key={item} variant="secondary">
          {item}
        </Badge>
      ))}
    </div>
  );
}

export function ParticipantDetail({ participantId }: { participantId: string }) {
  const { data: me } = useMe();
  const { data: participant, isPending } = useParticipant(participantId);

  if (isPending) {
    return <Skeleton className="h-96 w-full max-w-2xl" />;
  }
  if (!participant) return null;

  const canEdit = me?.role === "admin" || me?.role === "staff";
  // アカウント操作は admin か担当 staff のみ（最終判定は API 側）
  const canManageAccount =
    me?.role === "admin" || (me?.role === "staff" && participant.assignedStaffId === me.id);

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={participant.name}
        description={participant.kana ?? undefined}
        actions={
          canEdit ? (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={paths.participants.edit(participant.id)} />}
            >
              <Pencil aria-hidden className="size-4" />
              編集
            </Button>
          ) : undefined
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">基本情報</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="状態">
              {participant.isActive ? (
                <Badge variant="secondary">利用中</Badge>
              ) : (
                <Badge variant="outline">退所</Badge>
              )}
            </DetailRow>
            <DetailRow label="メールアドレス">{participant.email}</DetailRow>
            <DetailRow label="希望職種">
              <BadgeList items={participant.desiredOccupations} />
            </DetailRow>
            <DetailRow label="スキル">
              <BadgeList items={participant.skills} />
            </DetailRow>
            <DetailRow label="得意なこと">{participant.strengths}</DetailRow>
            <DetailRow label="不得意なこと">{participant.weaknesses}</DetailRow>
            <DetailRow label="必要な配慮">
              <BadgeList items={participant.accommodations} />
            </DetailRow>
            <DetailRow label="通勤条件">{participant.commuteConditions}</DetailRow>
            <DetailRow label="送迎">{participant.needsTransport ? "必要" : "不要"}</DetailRow>
            <DetailRow label="メモ">{participant.notes}</DetailRow>
          </dl>
        </CardContent>
      </Card>

      <ParticipantAccountCard participant={participant} canManage={canManageAccount} />
    </div>
  );
}
