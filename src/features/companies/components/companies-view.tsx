"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ListPagination } from "@/components/shared/list-pagination";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { useCompanies } from "../api/get-companies";

export function CompaniesView() {
  const router = useRouter();
  const { page, q, setFilter, setPage } = useListParams();
  const { data: me } = useMe();
  const { data, isPending } = useCompanies({ page, q: q || undefined });

  return (
    <div className="space-y-6">
      <PageHeader
        title="実習先企業"
        description="受け入れ企業の情報・定員・対応可能な配慮を管理します"
        actions={
          me?.role === "admin" ? (
            <Button nativeButton={false} render={<Link href={paths.companies.new} />}>
              <Plus aria-hidden className="size-4" />
              企業を登録
            </Button>
          ) : undefined
        }
      />

      <div className="relative max-w-sm">
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
                  <TableHead>企業名</TableHead>
                  <TableHead>業種</TableHead>
                  <TableHead className="text-right">受け入れ人数</TableHead>
                  <TableHead>対応可能な配慮</TableHead>
                  <TableHead>状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                      企業が見つかりません
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((company) => (
                    <TableRow
                      key={company.id}
                      className="cursor-pointer"
                      onClick={() => router.push(paths.companies.detail(company.id))}
                    >
                      <TableCell>
                        <Link
                          href={paths.companies.detail(company.id)}
                          className="font-medium hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {company.name}
                        </Link>
                      </TableCell>
                      <TableCell>{company.industry ?? "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {company.capacity} 名
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {company.supportedAccommodations.map((item) => (
                            <Badge key={item} variant="outline">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {company.isActive ? (
                          <Badge variant="secondary">受け入れ中</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            停止中
                          </Badge>
                        )}
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
