"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ListPagination } from "@/components/shared/list-pagination";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useListParams } from "@/hooks/use-list-params";
import { useMe } from "@/lib/auth";
import type { OptimizationStatus } from "@/types/api";

import { useRuns } from "../api/get-runs";

const statusConfig: Record<OptimizationStatus, { label: string; className: string }> = {
  PENDING: { label: "実行待ち", className: "text-muted-foreground" },
  RUNNING: { label: "実行中", className: "text-info" },
  SUCCEEDED: { label: "成功", className: "text-success" },
  FAILED: { label: "失敗", className: "text-destructive" },
  CANCELLED: { label: "中止", className: "text-muted-foreground" },
};

export function RunsView() {
  const router = useRouter();
  const { page, setPage } = useListParams();
  const { data: me } = useMe();
  const { data, isPending } = useRuns({ page });

  const canRun = me?.role === "admin" || me?.role === "staff";

  return (
    <div className="space-y-6">
      <PageHeader
        title="割当の自動提案"
        description="条件に合う実習割当の候補を生成します。提案は候補であり、最終判断は支援員が行います"
        actions={
          canRun ? (
            <Button nativeButton={false} render={<Link href={paths.optimization.new} />}>
              <Sparkles aria-hidden className="size-4" />
              提案を実行
            </Button>
          ) : undefined
        }
      />

      {isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="bg-card rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>実行日時</TableHead>
                  <TableHead>対象期間</TableHead>
                  <TableHead>対象</TableHead>
                  <TableHead>状態</TableHead>
                  <TableHead>候補</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                      まだ実行履歴がありません
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((run) => {
                    const status = statusConfig[run.status];
                    return (
                      <TableRow
                        key={run.id}
                        className="cursor-pointer"
                        onClick={() => router.push(paths.optimization.detail(run.id))}
                      >
                        <TableCell className="tabular-nums">
                          {new Date(run.createdAt).toLocaleString("ja-JP")}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {run.periodStart.slice(0, 10)} 〜 {run.periodEnd.slice(0, 10)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm tabular-nums">
                          利用者 {run.participantIds.length} ・ 企業 {run.companyIds.length}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-normal ${status.className}`}>
                            {status.label}
                          </Badge>
                          {run.selectedCandidate ? (
                            <Badge variant="secondary" className="ml-1 font-normal">
                              採用済み
                            </Badge>
                          ) : null}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {run.candidates?.length ?? "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {data ? <ListPagination meta={data.meta} onPageChange={setPage} /> : null}
        </>
      )}
    </div>
  );
}
