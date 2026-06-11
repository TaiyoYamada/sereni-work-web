"use client";

import {
  CalendarX,
  ChevronRight,
  CircleCheck,
  MessageCircleWarning,
  Send,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";
import type { Dashboard } from "@/types/api";

function QueueRow({
  icon: Icon,
  label,
  count,
  href,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  count: number;
  href: string;
  tone: "warning" | "info";
}) {
  return (
    <li>
      <Link
        href={href}
        className="hover:bg-muted/50 focus-visible:ring-ring flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <Icon
          aria-hidden
          className={`size-4 shrink-0 ${tone === "warning" ? "text-warning" : "text-info"}`}
        />
        <span className="flex-1 text-sm">{label}</span>
        <Badge variant={tone === "warning" ? "destructive" : "secondary"} className="tabular-nums">
          {count}件
        </Badge>
        <ChevronRight aria-hidden className="text-muted-foreground size-4" />
      </Link>
    </li>
  );
}

/** 今日対応すべき項目を集めたキュー。0件の項目は出さず、全て0なら完了表示にする */
export function ActionQueue({
  dashboard,
  isPending,
}: {
  dashboard: Dashboard | undefined;
  isPending: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">今日の対応</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending || !dashboard ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <QueueItems dashboard={dashboard} />
        )}
      </CardContent>
    </Card>
  );
}

function QueueItems({ dashboard }: { dashboard: Dashboard }) {
  const { counts, today } = dashboard;
  const hasItems =
    counts.submittedReports > 0 ||
    counts.needsActionReports > 0 ||
    counts.interviewNeededReports > 0 ||
    today.missingPreChecks.length > 0;

  if (!hasItems) {
    return (
      <p className="text-muted-foreground flex items-center gap-2 px-3 py-2 text-sm">
        <CircleCheck aria-hidden className="text-success size-4" />
        いま対応が必要な項目はありません
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {counts.needsActionReports > 0 ? (
        <QueueRow
          icon={TriangleAlert}
          label="要対応の日報"
          count={counts.needsActionReports}
          href={`${paths.reports.list}?status=NEEDS_ACTION`}
          tone="warning"
        />
      ) : null}
      {counts.interviewNeededReports > 0 ? (
        <QueueRow
          icon={MessageCircleWarning}
          label="面談を希望している日報"
          count={counts.interviewNeededReports}
          href={`${paths.reports.list}?interview=true`}
          tone="warning"
        />
      ) : null}
      {counts.submittedReports > 0 ? (
        <QueueRow
          icon={Send}
          label="確認待ちの日報"
          count={counts.submittedReports}
          href={`${paths.reports.list}?status=SUBMITTED`}
          tone="info"
        />
      ) : null}
      {today.missingPreChecks.map((item) => (
        <li key={item.assignmentId}>
          <Link
            href={paths.assignments.detail(item.assignmentId)}
            className="hover:bg-muted/50 focus-visible:ring-ring flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <CalendarX aria-hidden className="text-warning size-4 shrink-0" />
            <span className="flex-1 text-sm">
              {item.participantName}
              <span className="text-muted-foreground">
                （{item.companyName}）の本日のプレチェックが未提出です
              </span>
            </span>
            <ChevronRight aria-hidden className="text-muted-foreground size-4" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
