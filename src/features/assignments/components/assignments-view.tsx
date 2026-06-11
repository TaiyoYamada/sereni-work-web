"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FacetedFilter } from "@/components/shared/faceted-filter";
import { ListPagination } from "@/components/shared/list-pagination";
import { PageHeader } from "@/components/shared/page-header";
import { AssignmentStatusBadge, assignmentStatusLabels } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { useListParams } from "@/hooks/use-list-params";
import { useMe } from "@/lib/auth";
import type { Assignment, AssignmentStatus } from "@/types/api";

import { useAssignments } from "../api/get-assignments";

const statusOptions = Object.entries(assignmentStatusLabels).map(([value, label]) => ({
  value,
  label,
}));

const columns: ColumnDef<Assignment>[] = [
  {
    id: "participantName",
    header: "利用者",
    cell: ({ row }) => (
      <Link
        href={paths.assignments.detail(row.original.id)}
        className="font-medium hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {row.original.participantName}
      </Link>
    ),
  },
  {
    id: "companyName",
    header: "実習先",
    cell: ({ row }) => row.original.companyName,
  },
  {
    id: "period",
    header: "期間",
    cell: ({ row }) => (
      <span className="tabular-nums">
        {row.original.startDate} 〜 {row.original.endDate}
      </span>
    ),
  },
  {
    id: "status",
    header: "状態",
    cell: ({ row }) => <AssignmentStatusBadge status={row.original.status} />,
  },
];

export function AssignmentsView() {
  const router = useRouter();
  const { page, get, setFilter, setPage } = useListParams();
  const { data: me } = useMe();
  const status = get("status") as AssignmentStatus | undefined;
  const { data, isPending } = useAssignments({ page, status });

  const canEdit = me?.role === "admin" || me?.role === "staff";
  const createButton = (
    <Button nativeButton={false} render={<Link href={paths.assignments.new} />}>
      <Plus aria-hidden className="size-4" />
      割当を作成
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="実習割当"
        description="実習の割当・確定・進行状況を管理します"
        actions={canEdit ? createButton : undefined}
      />

      <div className="flex flex-wrap items-center gap-2">
        <FacetedFilter
          label="状態"
          options={statusOptions}
          value={status}
          onChange={(value) => setFilter("status", value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data}
        isPending={isPending}
        onRowClick={(assignment) => router.push(paths.assignments.detail(assignment.id))}
        empty={
          <EmptyState
            icon={Briefcase}
            title="割当が見つかりません"
            description={
              status
                ? "絞り込みを変更してお試しください"
                : "手動で割当を作成するか、自動提案で候補を生成できます"
            }
            action={canEdit && !status ? createButton : undefined}
          />
        }
      />
      {data ? <ListPagination meta={data.meta} onPageChange={setPage} /> : null}
    </div>
  );
}
