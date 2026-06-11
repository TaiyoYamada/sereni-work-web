"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { NotebookPen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FacetedFilter } from "@/components/shared/faceted-filter";
import { SortHeader } from "@/components/shared/sort-header";
import { ListPagination } from "@/components/shared/list-pagination";
import { PageHeader } from "@/components/shared/page-header";
import { ReportStatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { paths } from "@/config/paths";
import { useListParams } from "@/hooks/use-list-params";
import type { Report, ReportStatus } from "@/types/api";

import { useReports } from "../api/get-reports";

const ALL = "ALL";

const statusTabs: { value: string; label: string }[] = [
  { value: ALL, label: "すべて" },
  { value: "SUBMITTED", label: "確認待ち" },
  { value: "NEEDS_ACTION", label: "要対応" },
  { value: "REVIEWED", label: "確認済み" },
];

const interviewOptions = [{ value: "true", label: "面談が必要" }];

function scaleCell(value: number | null) {
  return <span className="tabular-nums">{value !== null ? `${value} / 5` : "—"}</span>;
}

const columns: ColumnDef<Report>[] = [
  {
    id: "reportDate",
    header: () => <SortHeader field="reportDate">日付</SortHeader>,
    cell: ({ row }) => <span className="tabular-nums">{row.original.reportDate}</span>,
  },
  {
    id: "participantName",
    header: "利用者",
    cell: ({ row }) => (
      <Link
        href={paths.reports.detail(row.original.id)}
        className="font-medium hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {row.original.participantName}
      </Link>
    ),
  },
  {
    id: "satisfaction",
    header: "満足度",
    cell: ({ row }) => scaleCell(row.original.satisfaction),
  },
  {
    id: "fatigue",
    header: "疲労度",
    cell: ({ row }) => scaleCell(row.original.fatigue),
  },
  {
    id: "status",
    header: "状態",
    cell: ({ row }) => <ReportStatusBadge status={row.original.status} />,
  },
  {
    id: "flags",
    header: "フラグ",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.wantsConsultation ? (
          <Badge variant="outline" className="text-warning">
            相談希望
          </Badge>
        ) : null}
        {row.original.interviewNeeded ? (
          <Badge variant="outline" className="text-warning">
            面談
          </Badge>
        ) : null}
      </div>
    ),
  },
];

export function ReportsView() {
  const router = useRouter();
  const { page, get, setFilter, setPage } = useListParams();
  const status = get("status") as ReportStatus | undefined;
  const interview = get("interview");
  const { data, isPending } = useReports({
    page,
    status,
    interviewNeeded: interview === "true" ? true : undefined,
    sort: get("sort"),
    order: get("order"),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="日報" description="利用者の日報を確認し、コメント・対応を記録します" />

      <div className="flex flex-wrap items-center gap-2">
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
        <FacetedFilter
          label="フラグ"
          options={interviewOptions}
          value={interview}
          onChange={(value) => setFilter("interview", value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data}
        isPending={isPending}
        onRowClick={(report) => router.push(paths.reports.detail(report.id))}
        empty={
          <EmptyState
            icon={NotebookPen}
            title="日報が見つかりません"
            description={
              status || interview
                ? "タブ・絞り込みを変更してお試しください"
                : "利用者が iOS アプリから日報を提出すると、ここに表示されます"
            }
          />
        }
      />
      {data ? <ListPagination meta={data.meta} onPageChange={setPage} /> : null}
    </div>
  );
}
