"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ListPagination } from "@/components/shared/list-pagination";
import { PageHeader } from "@/components/shared/page-header";
import { AssignmentStatusBadge, assignmentStatusLabels } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useMe } from "@/lib/auth";
import { useListParams } from "@/hooks/use-list-params";
import type { AssignmentStatus } from "@/types/api";

import { useAssignments } from "../api/get-assignments";

const ALL = "ALL";

export function AssignmentsView() {
  const router = useRouter();
  const { page, get, setFilter, setPage } = useListParams();
  const { data: me } = useMe();
  const status = get("status") as AssignmentStatus | undefined;
  const { data, isPending } = useAssignments({ page, status });

  const canEdit = me?.role === "admin" || me?.role === "staff";

  return (
    <div className="space-y-6">
      <PageHeader
        title="実習割当"
        description="実習の割当・確定・進行状況を管理します"
        actions={
          canEdit ? (
            <Button nativeButton={false} render={<Link href={paths.assignments.new} />}>
              <Plus aria-hidden className="size-4" />
              割当を作成
            </Button>
          ) : undefined
        }
      />

      <div className="w-48">
        <Select
          value={status ?? ALL}
          onValueChange={(value) => setFilter("status", value && value !== ALL ? value : undefined)}
        >
          <SelectTrigger aria-label="状態で絞り込み">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>すべての状態</SelectItem>
            {Object.entries(assignmentStatusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                  <TableHead>利用者</TableHead>
                  <TableHead>実習先</TableHead>
                  <TableHead>期間</TableHead>
                  <TableHead>状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground h-24 text-center">
                      割当が見つかりません
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((assignment) => (
                    <TableRow
                      key={assignment.id}
                      className="cursor-pointer"
                      onClick={() => router.push(paths.assignments.detail(assignment.id))}
                    >
                      <TableCell>
                        <Link
                          href={paths.assignments.detail(assignment.id)}
                          className="font-medium hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {assignment.participantName}
                        </Link>
                      </TableCell>
                      <TableCell>{assignment.companyName}</TableCell>
                      <TableCell className="tabular-nums">
                        {assignment.startDate} 〜 {assignment.endDate}
                      </TableCell>
                      <TableCell>
                        <AssignmentStatusBadge status={assignment.status} />
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
