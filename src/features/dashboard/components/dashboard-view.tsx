"use client";

import { Briefcase, CalendarCheck, NotebookPen, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";

import { useDashboard } from "../api/get-dashboard";
import { ActionQueue } from "./action-queue";
import { ConditionTrendChart } from "./condition-trend-chart";
import { ReportTrendChart } from "./report-trend-chart";
import { StatusDistributionChart } from "./status-distribution-chart";

function StatCard({
  title,
  value,
  icon: Icon,
  href,
}: {
  title: string;
  value: string | undefined;
  icon: LucideIcon;
  href: string;
}) {
  return (
    <Link href={href} className="focus-visible:ring-ring rounded-xl focus-visible:ring-2">
      <Card className="hover:bg-muted/50 h-full transition-colors">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
          <Icon aria-hidden className="text-primary size-4" />
        </CardHeader>
        <CardContent>
          {value === undefined ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-3xl font-bold tabular-nums">{value}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function DashboardView() {
  const { data, isPending } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader title="ダッシュボード" description="今日の対応事項と実習・日報の状況" />

      <ActionQueue dashboard={data} isPending={isPending} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="実習中"
          value={data ? String(data.counts.inProgressAssignments) : undefined}
          icon={Briefcase}
          href={`${paths.assignments.list}?status=IN_PROGRESS`}
        />
        <StatCard
          title="実習予定（確定済み）"
          value={data ? String(data.counts.confirmedAssignments) : undefined}
          icon={CalendarCheck}
          href={`${paths.assignments.list}?status=CONFIRMED`}
        />
        <StatCard
          title="本日の日報提出"
          value={
            data ? `${data.today.submittedReports} / ${data.today.expectedReports}` : undefined
          }
          icon={NotebookPen}
          href={paths.reports.list}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReportTrendChart data={data?.reportTrend} />
        <ConditionTrendChart data={data?.conditionTrend} />
        <StatusDistributionChart data={data?.assignmentStatusCounts} />
      </div>
    </div>
  );
}
