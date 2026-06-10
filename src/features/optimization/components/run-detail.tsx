"use client";

import { CircleCheck, Sparkles, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { paths } from "@/config/paths";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";
import { useMe } from "@/lib/auth";
import type { OptimizationCandidate } from "@/types/api";

import { useAdoptCandidate } from "../api/adopt-candidate";
import { useRun } from "../api/get-run";

const BREAKDOWN_LABELS: Record<string, string> = {
  desire: "希望",
  skill: "スキル",
  fairness: "公平性",
  rotation: "新しい経験",
};

function CandidateCard({
  candidate,
  index,
  canAdopt,
  isAdopted,
  onAdopt,
  adopting,
}: {
  candidate: OptimizationCandidate;
  index: number;
  canAdopt: boolean;
  isAdopted: boolean;
  onAdopt: () => void;
  adopting: boolean;
}) {
  const hasViolations = candidate.violations.length > 0;
  return (
    <Card className={isAdopted ? "border-primary" : undefined}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">
          候補 {index + 1}
          {isAdopted ? (
            <Badge className="ml-2">
              <CircleCheck aria-hidden className="size-3" />
              採用済み
            </Badge>
          ) : null}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-1">
          <Badge variant="secondary" className="tabular-nums">
            総合スコア {candidate.score.toFixed(2)}
          </Badge>
          {Object.entries(candidate.scoreBreakdown).map(([key, value]) => (
            <Badge key={key} variant="outline" className="font-normal tabular-nums">
              {BREAKDOWN_LABELS[key] ?? key} {value.toFixed(2)}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasViolations ? (
          <p
            role="alert"
            className="bg-warning-bg text-warning flex items-center gap-2 rounded-lg p-3 text-sm"
          >
            <TriangleAlert aria-hidden className="size-4 shrink-0" />
            制約違反があるため、この候補は採用できません
          </p>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>利用者</TableHead>
              <TableHead>実習先</TableHead>
              <TableHead>提案理由</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidate.assignments.map((assignment) => (
              <TableRow key={`${assignment.participantId}-${assignment.companyId}`}>
                <TableCell className="font-medium">{assignment.participantName}</TableCell>
                <TableCell>{assignment.companyName}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {assignment.reasons.map((reason) => (
                      <Badge key={reason} variant="secondary" className="font-normal">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {canAdopt && !hasViolations ? (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button disabled={adopting}>
                  <Sparkles aria-hidden className="size-4" />
                  この候補を採用する
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>候補 {index + 1} を採用しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  {candidate.assignments.length}
                  件の割当が「提案中」として作成されます。確定は割当画面で内容を確認してから行います（自動では確定されません）。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={onAdopt}>採用する</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function RunDetail({ runId }: { runId: string }) {
  const { data: me } = useMe();
  const { data: run, isPending } = useRun(runId);
  const adoptMutation = useAdoptCandidate();
  const errorMessage = useApiErrorMessage();

  if (isPending) return <Skeleton className="h-96 w-full max-w-3xl" />;
  if (!run) return null;

  const canOperate = me?.role === "admin" || me?.role === "staff";
  const alreadyAdopted = run.selectedCandidate !== null;

  async function adopt(candidateIndex: number) {
    try {
      await adoptMutation.mutateAsync({ runId, candidateIndex });
      toast.success("候補を採用しました。割当画面で確認・確定してください");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="自動提案の結果"
        description={`${run.periodStart.slice(0, 10)} 〜 ${run.periodEnd.slice(0, 10)} ・ ${new Date(run.createdAt).toLocaleString("ja-JP")} 実行`}
        actions={
          <div className="text-muted-foreground flex items-center gap-3 text-sm tabular-nums">
            {run.variableCount !== null ? <span>変数 {run.variableCount}</span> : null}
            {run.executionTimeMs !== null ? <span>{run.executionTimeMs}ms</span> : null}
          </div>
        }
      />

      {run.status === "FAILED" ? (
        <p role="alert" className="text-destructive bg-destructive/10 rounded-lg p-4 text-sm">
          提案の生成に失敗しました: {run.errorMessage ?? "原因不明のエラー"}。
          条件を変えて再実行するか、手動で割当を作成してください。
        </p>
      ) : null}

      {alreadyAdopted ? (
        <p className="bg-muted flex items-center justify-between gap-2 rounded-lg p-4 text-sm">
          <span>この実行の候補は採用済みです。</span>
          <Link
            href={`${paths.assignments.list}?status=PROPOSED`}
            className="text-primary font-medium hover:underline"
          >
            提案中の割当を確認する →
          </Link>
        </p>
      ) : null}

      {(run.candidates ?? []).map((candidate, index) => (
        <CandidateCard
          key={index}
          candidate={candidate}
          index={index}
          canAdopt={canOperate && !alreadyAdopted}
          isAdopted={
            alreadyAdopted && JSON.stringify(run.selectedCandidate) === JSON.stringify(candidate)
          }
          onAdopt={() => adopt(index)}
          adopting={adoptMutation.isPending}
        />
      ))}

      {run.status === "SUCCEEDED" && (run.candidates ?? []).length === 0 ? (
        <p className="text-muted-foreground text-sm">
          条件を満たす割当候補が見つかりませんでした。対象や期間を変えて再実行してください。
        </p>
      ) : null}
    </div>
  );
}
