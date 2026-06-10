"use client";

import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { ReportStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/lib/auth";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";

import { useAddComment } from "../api/add-comment";
import { useReport } from "../api/get-report";
import { useReviewReport } from "../api/review-report";

const scoreItems = [
  ["satisfaction", "満足度"],
  ["fatigue", "疲労度"],
  ["anxiety", "不安度"],
  ["difficulty", "作業難易度"],
  ["comfort", "職場の居心地"],
  ["instructionClarity", "指示の分かりやすさ"],
  ["wantsToContinue", "継続して働きたいか"],
] as const;

const textItems = [
  ["workDescription", "今日行った作業"],
  ["didWell", "できたこと"],
  ["difficult", "難しかったこと"],
  ["enjoyed", "楽しかったこと"],
  ["troubled", "困ったこと"],
  ["freeText", "自由記述"],
] as const;

export function ReportDetail({ reportId }: { reportId: string }) {
  const { data: me } = useMe();
  const { data: report, isPending } = useReport(reportId);
  const errorMessage = useApiErrorMessage();
  const reviewMutation = useReviewReport();
  const commentMutation = useAddComment();
  const [commentBody, setCommentBody] = useState("");
  const [interviewNeeded, setInterviewNeeded] = useState(false);

  if (isPending) return <Skeleton className="h-96 w-full max-w-2xl" />;
  if (!report) return null;

  const canOperate = me?.role === "admin" || me?.role === "staff";
  const canReview = report.status === "SUBMITTED" || report.status === "NEEDS_ACTION";

  async function review(result: "REVIEWED" | "NEEDS_ACTION") {
    try {
      await reviewMutation.mutateAsync({ id: reportId, result, interviewNeeded });
      toast.success(result === "REVIEWED" ? "確認済みにしました" : "要対応にしました");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  async function submitComment() {
    try {
      await commentMutation.mutateAsync({ id: reportId, body: commentBody.trim() });
      setCommentBody("");
      toast.success("コメントを送信しました");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={`${report.participantName} の日報`}
        description={report.reportDate}
        actions={<ReportStatusBadge status={report.status} />}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">体調・気持ちのスコア</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-3">
            {scoreItems.map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-2 border-b py-2">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium tabular-nums">
                  {report[key] !== null ? `${report[key]} / 5` : "—"}
                </dd>
              </div>
            ))}
          </dl>
          <div className="text-muted-foreground mt-4 flex flex-wrap gap-4 text-sm">
            <span>配慮は十分だったか: {formatBoolean(report.accommodationSufficient)}</span>
            <span>相談したいか: {report.wantsConsultation ? "はい" : "いいえ"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">記録（原文）</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4 text-sm">
            {textItems.map(([key, label]) =>
              report[key] ? (
                <div key={key}>
                  <dt className="text-muted-foreground mb-1">{label}</dt>
                  <dd className="whitespace-pre-wrap">{report[key]}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">支援員コメント</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {report.comments.length === 0 ? (
            <p className="text-muted-foreground text-sm">まだコメントはありません</p>
          ) : (
            <ul className="space-y-3">
              {report.comments.map((comment) => (
                <li key={comment.id} className="bg-muted rounded-lg p-3 text-sm">
                  <p className="whitespace-pre-wrap">{comment.body}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {comment.staffName} ・ {new Date(comment.createdAt).toLocaleString("ja-JP")}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {canOperate ? (
            <div className="space-y-2">
              <Field>
                <FieldLabel htmlFor="comment-body">コメントを書く</FieldLabel>
                <Textarea
                  id="comment-body"
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="利用者本人にも表示されます。ねぎらいの言葉を添えましょう"
                />
              </Field>
              <Button
                size="sm"
                disabled={commentBody.trim().length === 0 || commentMutation.isPending}
                onClick={submitComment}
              >
                コメントを送信
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {canOperate && canReview ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">確認操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field orientation="horizontal">
              <Checkbox
                id="interview-needed"
                checked={interviewNeeded}
                onCheckedChange={(checked) => setInterviewNeeded(checked === true)}
              />
              <FieldLabel htmlFor="interview-needed">面談が必要</FieldLabel>
            </Field>
            <div className="flex gap-2">
              <Button onClick={() => review("REVIEWED")} disabled={reviewMutation.isPending}>
                確認済みにする
              </Button>
              {report.status === "SUBMITTED" ? (
                <Button
                  variant="outline"
                  className="text-warning"
                  onClick={() => review("NEEDS_ACTION")}
                  disabled={reviewMutation.isPending}
                >
                  要対応にする
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function formatBoolean(value: boolean | null): string {
  if (value === null) return "—";
  return value ? "はい" : "いいえ";
}
