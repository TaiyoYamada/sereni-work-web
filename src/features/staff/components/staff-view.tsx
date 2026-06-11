"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MailPlus, Search, UserCog } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FacetedFilter } from "@/components/shared/faceted-filter";
import { SortHeader } from "@/components/shared/sort-header";
import { ListPagination } from "@/components/shared/list-pagination";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";
import { useListParams } from "@/hooks/use-list-params";
import { useMe } from "@/lib/auth";
import type { Staff, StaffRole } from "@/types/api";

import { useStaff } from "../api/get-staff";
import { useInviteStaff } from "../api/invite-staff";
import { roleLabel, roleOptions } from "../schemas/staff";
import { StaffFormDialog } from "./staff-form-dialog";

const activeOptions = [
  { value: "true", label: "有効" },
  { value: "false", label: "停止" },
];

/** 招待メール送信セル。行ごとに mutation を持ち、送信中はその行だけ無効化する */
function InviteCell({ member }: { member: Staff }) {
  const errorMessage = useApiErrorMessage();
  const inviteMutation = useInviteStaff();

  async function sendInvite() {
    try {
      await inviteMutation.mutateAsync(member.id);
      toast.success(`${member.name}さんへ招待メールを送りました`);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (!member.isActive) return null;

  if (!member.hasAccount) {
    return (
      <Button variant="outline" size="sm" disabled={inviteMutation.isPending} onClick={sendInvite}>
        <MailPlus aria-hidden className="size-4" />
        招待メールを送る
      </Button>
    );
  }

  // 初回ログイン前の招待紛失に備える。ログイン済みの職員には API が CONFLICT を返す
  return (
    <Button variant="ghost" size="sm" disabled={inviteMutation.isPending} onClick={sendInvite}>
      <MailPlus aria-hidden className="size-4" />
      招待を再送
    </Button>
  );
}

const baseColumns: ColumnDef<Staff>[] = [
  {
    id: "name",
    header: () => <SortHeader field="name">氏名</SortHeader>,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    id: "email",
    header: "メールアドレス",
    cell: ({ row }) => row.original.email,
  },
  {
    id: "role",
    header: "ロール",
    cell: ({ row }) => roleLabel(row.original.role),
  },
  {
    id: "isActive",
    header: "状態",
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge variant="secondary">有効</Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          停止
        </Badge>
      ),
  },
  {
    id: "account",
    header: "アカウント",
    cell: ({ row }) =>
      row.original.hasAccount ? (
        <Badge variant="secondary">発行済み</Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          未発行
        </Badge>
      ),
  },
];

const actionColumn: ColumnDef<Staff> = {
  id: "actions",
  header: "操作",
  meta: { className: "w-44" },
  cell: ({ row }) => <InviteCell member={row.original} />,
};

export function StaffView() {
  const { page, q, get, setFilter, setPage } = useListParams();
  const { data: me } = useMe();
  const role = get("role") as StaffRole | undefined;
  const isActive = get("isActive");
  const { data, isPending } = useStaff({
    page,
    q: q || undefined,
    role,
    isActive: isActive === undefined ? undefined : isActive === "true",
    sort: get("sort"),
    order: get("order"),
  });

  const isAdmin = me?.role === "admin";
  const columns = useMemo(
    () => (isAdmin ? [...baseColumns, actionColumn] : baseColumns),
    [isAdmin],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="職員"
        description="職員アカウントの登録・招待・権限を管理します"
        actions={isAdmin ? <StaffFormDialog /> : undefined}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1 basis-64">
          <Search
            aria-hidden
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            type="search"
            aria-label="職員を検索"
            placeholder="名前・メールで検索"
            className="pl-9"
            defaultValue={q}
            onChange={(e) => setFilter("q", e.target.value || undefined)}
          />
        </div>
        <FacetedFilter
          label="ロール"
          options={roleOptions}
          value={role}
          onChange={(value) => setFilter("role", value)}
        />
        <FacetedFilter
          label="状態"
          options={activeOptions}
          value={isActive}
          onChange={(value) => setFilter("isActive", value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data}
        isPending={isPending}
        empty={
          <EmptyState
            icon={UserCog}
            title="職員が見つかりません"
            description={
              q || role || isActive
                ? "検索条件・絞り込みを変更してお試しください"
                : "職員を登録し、招待メールを送るとログインできるようになります"
            }
          />
        }
      />
      {data ? <ListPagination meta={data.meta} onPageChange={setPage} /> : null}
    </div>
  );
}
