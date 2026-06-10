"use client";

import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { AssignmentStatusBadge } from "@/components/shared/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/lib/auth";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";

import {
  useCancelAssignment,
  useCompleteAssignment,
  useConfirmAssignment,
  useStartAssignment,
} from "../api/assignment-actions";
import { useAssignment } from "../api/get-assignment";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2">{children ?? "—"}</dd>
    </div>
  );
}

export function AssignmentDetail({ assignmentId }: { assignmentId: string }) {
  const { data: me } = useMe();
  const { data: assignment, isPending } = useAssignment(assignmentId);
  const errorMessage = useApiErrorMessage();

  const confirmMutation = useConfirmAssignment();
  const startMutation = useStartAssignment();
  const completeMutation = useCompleteAssignment();
  const cancelMutation = useCancelAssignment();
  const [cancelReason, setCancelReason] = useState("");

  if (isPending) return <Skeleton className="h-96 w-full max-w-2xl" />;
  if (!assignment) return null;

  const isAdmin = me?.role === "admin";
  const canOperate = me?.role === "admin" || me?.role === "staff";

  async function run(action: () => Promise<unknown>, successMessage: string) {
    try {
      await action();
      toast.success(successMessage);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={`${assignment.participantName} — ${assignment.companyName}`}
        actions={<AssignmentStatusBadge status={assignment.status} />}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">実習情報</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="期間">
              <span className="tabular-nums">
                {assignment.startDate} 〜 {assignment.endDate}
              </span>
            </DetailRow>
            <DetailRow label="集合場所">{assignment.meetingPlace}</DetailRow>
            <DetailRow label="目標">{assignment.goal}</DetailRow>
            {assignment.proposalReason ? (
              <DetailRow label="提案理由">{assignment.proposalReason}</DetailRow>
            ) : null}
            {assignment.cancelledReason ? (
              <DetailRow label="中止理由">{assignment.cancelledReason}</DetailRow>
            ) : null}
          </dl>
        </CardContent>
      </Card>

      {canOperate ? (
        <div className="flex flex-wrap gap-2">
          {/* 確定は管理者のみ（API 側でも強制される） */}
          {isAdmin && (assignment.status === "DRAFT" || assignment.status === "PROPOSED") ? (
            <AlertDialog>
              <AlertDialogTrigger render={<Button>割当を確定する</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>割当を確定しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    受け入れ定員と期間の重複を確認したうえで確定されます。確定後は内容を直接編集できません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      run(() => confirmMutation.mutateAsync(assignment.id), "割当を確定しました")
                    }
                  >
                    確定する
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}

          {assignment.status === "CONFIRMED" ? (
            <Button
              onClick={() =>
                run(() => startMutation.mutateAsync(assignment.id), "実習を開始しました")
              }
            >
              実習を開始する
            </Button>
          ) : null}

          {assignment.status === "IN_PROGRESS" ? (
            <Button
              onClick={() =>
                run(() => completeMutation.mutateAsync(assignment.id), "実習を完了しました")
              }
            >
              実習を完了する
            </Button>
          ) : null}

          {assignment.status !== "COMPLETED" && assignment.status !== "CANCELLED" ? (
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive">実習を中止する</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>実習を中止しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    実習を中止します。利用者への通知は自動では送信されません。中止理由は記録に残ります。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Field>
                  <FieldLabel htmlFor="cancel-reason">中止理由（必須）</FieldLabel>
                  <Textarea
                    id="cancel-reason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="体調不良のため、など"
                  />
                </Field>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={cancelReason.trim().length === 0}
                    onClick={() =>
                      run(
                        () =>
                          cancelMutation.mutateAsync({
                            id: assignment.id,
                            reason: cancelReason.trim(),
                          }),
                        "実習を中止しました",
                      )
                    }
                  >
                    中止する
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
