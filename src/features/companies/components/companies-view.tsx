"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Building2, Plus, Search } from "lucide-react";
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
import type { Company } from "@/types/api";

import { useCompanies } from "../api/get-companies";

const activeOptions = [
  { value: "true", label: "受け入れ中" },
  { value: "false", label: "停止中" },
];

const columns: ColumnDef<Company>[] = [
  {
    id: "name",
    header: () => <SortHeader field="name">企業名</SortHeader>,
    cell: ({ row }) => (
      <Link
        href={paths.companies.detail(row.original.id)}
        className="font-medium hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    id: "industry",
    header: "業種",
    cell: ({ row }) => row.original.industry ?? "—",
  },
  {
    id: "capacity",
    header: () => (
      <span className="flex justify-end">
        <SortHeader field="capacity">受け入れ人数</SortHeader>
      </span>
    ),
    meta: { className: "text-right" },
    cell: ({ row }) => <span className="tabular-nums">{row.original.capacity} 名</span>,
  },
  {
    id: "supportedAccommodations",
    header: "対応可能な配慮",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.supportedAccommodations.map((item) => (
          <Badge key={item} variant="outline">
            {item}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "isActive",
    header: "状態",
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge variant="secondary">受け入れ中</Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          停止中
        </Badge>
      ),
  },
];

export function CompaniesView() {
  const router = useRouter();
  const { page, q, get, setFilter, setPage } = useListParams();
  const { data: me } = useMe();
  const isActive = get("isActive");
  const { data, isPending } = useCompanies({
    page,
    q: q || undefined,
    isActive: isActive === undefined ? undefined : isActive === "true",
    sort: get("sort"),
    order: get("order"),
  });

  const isAdmin = me?.role === "admin";
  const registerButton = (
    <Button nativeButton={false} render={<Link href={paths.companies.new} />}>
      <Plus aria-hidden className="size-4" />
      企業を登録
    </Button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="実習先企業"
        description="受け入れ企業の情報・定員・対応可能な配慮を管理します"
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
            aria-label="企業を検索"
            placeholder="企業名・業種で検索"
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
        onRowClick={(company) => router.push(paths.companies.detail(company.id))}
        empty={
          <EmptyState
            icon={Building2}
            title="企業が見つかりません"
            description={
              q || isActive
                ? "検索条件・絞り込みを変更してお試しください"
                : "実習先企業を登録すると、割当や自動提案の対象にできます"
            }
            action={isAdmin && !q && !isActive ? registerButton : undefined}
          />
        }
      />
      {data ? <ListPagination meta={data.meta} onPageChange={setPage} /> : null}
    </div>
  );
}
