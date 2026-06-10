"use client";

import { Briefcase, CalendarCheck, Send, TriangleAlert, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";

import { useDashboardStats } from "../api/get-dashboard-stats";

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  tone,
}: {
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  href: string;
  tone?: "warning";
}) {
  return (
    <Link href={href} className="focus-visible:ring-ring rounded-xl focus-visible:ring-2">
      <Card className="hover:bg-muted/50 h-full transition-colors">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
          <Icon
            aria-hidden
            className={`size-4 ${tone === "warning" ? "text-warning" : "text-primary"}`}
          />
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
  const { data: stats } = useDashboardStats();

  return (
    <div className="space-y-6">
      <PageHeader title="ダッシュボード" description="実習と日報の今の状況" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="実習中"
          value={stats?.inProgress}
          icon={Briefcase}
          href={`${paths.assignments.list}?status=IN_PROGRESS`}
        />
        <StatCard
          title="実習予定（確定済み）"
          value={stats?.confirmed}
          icon={CalendarCheck}
          href={`${paths.assignments.list}?status=CONFIRMED`}
        />
        <StatCard
          title="確認待ちの日報"
          value={stats?.submitted}
          icon={Send}
          href={`${paths.reports.list}?status=SUBMITTED`}
        />
        <StatCard
          title="要対応の日報"
          value={stats?.needsAction}
          icon={TriangleAlert}
          href={`${paths.reports.list}?status=NEEDS_ACTION`}
          tone="warning"
        />
      </div>
    </div>
  );
}
