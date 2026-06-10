"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ListPagination } from "@/components/shared/list-pagination";
import { PageHeader } from "@/components/shared/page-header";
import { ReportStatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { paths } from "@/config/paths";
import { useListParams } from "@/hooks/use-list-params";
import type { ReportStatus } from "@/types/api";

import { useReports } from "../api/get-reports";

const ALL = "ALL";

const statusTabs: { value: string; label: string }[] = [
  { value: ALL, label: "すべて" },
  { value: "SUBMITTED", label: "確認待ち" },
  { value: "NEEDS_ACTION", label: "要対応" },
  { value: "REVIEWED", label: "確認済み" },
];

export function ReportsView() {
  const router = useRouter();
  const { page, get, setFilter, setPage } = useListParams();
  const status = get("status") as ReportStatus | undefined;
  const { data, isPending } = useReports({ page, status });

  return (
    <div className="space-y-6">
      <PageHeader title="日報" description="利用者の日報を確認し、コメント・対応を記録します" />

      <Tabs
        value={status ?? ALL}
        onValueChange={(value) => setFilter("status", value === ALL ? undefined : value)}
      >
        <TabsList>
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
                  <TableHead>日付</TableHead>
                  <TableHead>利用者</TableHead>
                  <TableHead>満足度</TableHead>
                  <TableHead>疲労度</TableHead>
                  <TableHead>状態</TableHead>
                  <TableHead>フラグ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground h-24 text-center">
                      日報が見つかりません
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((report) => (
                    <TableRow
                      key={report.id}
                      className="cursor-pointer"
                      onClick={() => router.push(paths.reports.detail(report.id))}
                    >
                      <TableCell className="tabular-nums">{report.reportDate}</TableCell>
                      <TableCell>
                        <Link
                          href={paths.reports.detail(report.id)}
                          className="font-medium hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {report.participantName}
                        </Link>
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {report.satisfaction !== null ? `${report.satisfaction} / 5` : "—"}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {report.fatigue !== null ? `${report.fatigue} / 5` : "—"}
                      </TableCell>
                      <TableCell>
                        <ReportStatusBadge status={report.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {report.wantsConsultation ? (
                            <Badge variant="outline" className="text-warning">
                              相談希望
                            </Badge>
                          ) : null}
                          {report.interviewNeeded ? (
                            <Badge variant="outline" className="text-warning">
                              面談
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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
