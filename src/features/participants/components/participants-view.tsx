"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FacetedFilter } from "@/components/shared/faceted-filter";
import { SortHeader } from "@/components/shared/sort-header";
import { ListPagination } from "@/components/shared/list-pagination";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { paths } from "@/config/paths";
import { useListParams } from "@/hooks/use-list-params";
import { useMe } from "@/lib/auth";
import type { Participant } from "@/types/api";

import { useParticipants } from "../api/get-participants";

const activeOptions = [
  { value: "true", label: "利用中" },
  { value: "false", label: "退所" },
];

const columns: ColumnDef<Participant>[] = [
  {
    id: "name",
    header: () => <SortHeader field="name">氏名</SortHeader>,
    cell: ({ row }) => (
      <>
        <Link
          href={paths.participants.detail(row.original.id)}
          className="font-medium hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.name}
        </Link>
        {row.original.kana ? (
          <span className="text-muted-foreground block text-xs">{row.original.kana}</span>
        ) : null}
      </>
    ),
  },
  {
    id: "desiredOccupations",
    header: "希望職種",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.desiredOccupations.map((occupation) => (
          <Badge key={occupation} variant="secondary">
            {occupation}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "accommodations",
    header: "必要な配慮",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.accommodations.map((accommodation) => (
          <Badge key={accommodation} variant="outline">
            {accommodation}
          </Badge>
        ))}
      </div>
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
  {
    id: "isActive",
    header: "状態",
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge variant="secondary">利用中</Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          退所
        </Badge>
      ),
  },
];

export function ParticipantsView() {
  const router = useRouter();
  const { page, q, get, setFilter, setPage } = useListParams();
  const { data: me } = useMe();
  const isActive = get("isActive");
  const { data, isPending } = useParticipants({
    page,
    q: q || undefined,
    isActive: isActive === undefined ? undefined : isActive === "true",
    sort: get("sort"),
    order: get("order"),
  });

  const isAdmin = me?.role === "admin";
  const registerButton = (
    <Button nativeButton={false} render={<Link href={paths.participants.new} />}>
      <Plus aria-hidden className="size-4" />
      利用者を登録
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="利用者"
        description="利用者の基本情報・希望・配慮事項を管理します"
        actions={isAdmin ? registerButton : undefined}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1 basis-64">
          <Search
            aria-hidden
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            type="search"
            aria-label="利用者を検索"
            placeholder="名前・かなで検索"
            className="pl-9"
            defaultValue={q}
            onChange={(e) => setFilter("q", e.target.value || undefined)}
          />
        </div>
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
        onRowClick={(participant) => router.push(paths.participants.detail(participant.id))}
        empty={
          <EmptyState
            icon={Users}
            title="利用者が見つかりません"
            description={
              q || isActive
                ? "検索条件・絞り込みを変更してお試しください"
                : "利用者を登録すると、実習割当や日報の管理ができるようになります"
            }
            action={isAdmin && !q && !isActive ? registerButton : undefined}
          />
        }
      />
      {data ? <ListPagination meta={data.meta} onPageChange={setPage} /> : null}
    </div>
  );
}
