"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { useListParams } from "@/hooks/use-list-params";
import { useMe } from "@/lib/auth";
import type { OptimizationRun, OptimizationStatus } from "@/types/api";

import { useRuns } from "../api/get-runs";

const statusConfig: Record<OptimizationStatus, { label: string; className: string }> = {
  PENDING: { label: "実行待ち", className: "text-muted-foreground" },
  RUNNING: { label: "実行中", className: "text-info" },
  SUCCEEDED: { label: "成功", className: "text-success" },
  FAILED: { label: "失敗", className: "text-destructive" },
  CANCELLED: { label: "中止", className: "text-muted-foreground" },
};

const columns: ColumnDef<OptimizationRun>[] = [
  {
    id: "createdAt",
    header: "実行日時",
    cell: ({ row }) => (
      <Link
        href={paths.optimization.detail(row.original.id)}
        className="font-medium tabular-nums hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {new Date(row.original.createdAt).toLocaleString("ja-JP")}
      </Link>
    ),
  },
  {
    id: "period",
    header: "対象期間",
    cell: ({ row }) => (
      <span className="tabular-nums">
        {row.original.periodStart.slice(0, 10)} 〜 {row.original.periodEnd.slice(0, 10)}
      </span>
    ),
  },
  {
    id: "targets",
    header: "対象",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm tabular-nums">
        利用者 {row.original.participantIds.length} ・ 企業 {row.original.companyIds.length}
      </span>
    ),
  },
  {
    id: "status",
    header: "状態",
    cell: ({ row }) => {
      const status = statusConfig[row.original.status];
      return (
        <>
          <Badge variant="outline" className={`font-normal ${status.className}`}>
            {status.label}
          </Badge>
          {row.original.selectedCandidate ? (
            <Badge variant="secondary" className="ml-1 font-normal">
              採用済み
            </Badge>
          ) : null}
        </>
      );
    },
  },
  {
    id: "candidates",
    header: "候補",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.candidates?.length ?? "—"}</span>
    ),
  },
];

export function RunsView() {
  const router = useRouter();
  const { page, setPage } = useListParams();
  const { data: me } = useMe();
  const { data, isPending } = useRuns({ page });

  const canRun = me?.role === "admin" || me?.role === "staff";
  const runButton = (
    <Button nativeButton={false} render={<Link href={paths.optimization.new} />}>
      <Sparkles aria-hidden className="size-4" />
      提案を実行
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="割当の自動提案"
        description="条件に合う実習割当の候補を生成します。提案は候補であり、最終判断は支援員が行います"
        actions={canRun ? runButton : undefined}
      />

      <DataTable
        columns={columns}
        data={data?.data}
        isPending={isPending}
        onRowClick={(run) => router.push(paths.optimization.detail(run.id))}
        empty={
          <EmptyState
            icon={Sparkles}
            title="まだ実行履歴がありません"
            description="対象の利用者・企業・期間を選んで、割当候補の自動提案を実行できます"
            action={canRun ? runButton : undefined}
          />
        }
      />
      {data ? <ListPagination meta={data.meta} onPageChange={setPage} /> : null}
    </div>
  );
}
