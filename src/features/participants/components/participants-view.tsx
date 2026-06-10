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

import { useParticipants } from "../api/get-participants";

export function ParticipantsView() {
  const router = useRouter();
  const { page, q, setFilter, setPage } = useListParams();
  const { data: me } = useMe();
  const { data, isPending } = useParticipants({ page, q: q || undefined });

  return (
    <div className="space-y-6">
      <PageHeader
        title="利用者"
        description="利用者の基本情報・希望・配慮事項を管理します"
        actions={
          me?.role === "admin" ? (
            <Button nativeButton={false} render={<Link href={paths.participants.new} />}>
              <Plus aria-hidden className="size-4" />
              利用者を登録
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
          aria-label="利用者を検索"
          placeholder="名前・かなで検索"
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
                  <TableHead>氏名</TableHead>
                  <TableHead>希望職種</TableHead>
                  <TableHead>必要な配慮</TableHead>
                  <TableHead>状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground h-24 text-center">
                      利用者が見つかりません
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((participant) => (
                    <TableRow
                      key={participant.id}
                      className="cursor-pointer"
                      onClick={() => router.push(paths.participants.detail(participant.id))}
                    >
                      <TableCell>
                        <Link
                          href={paths.participants.detail(participant.id)}
                          className="font-medium hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {participant.name}
                        </Link>
                        {participant.kana ? (
                          <span className="text-muted-foreground block text-xs">
                            {participant.kana}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {participant.desiredOccupations.map((occupation) => (
                            <Badge key={occupation} variant="secondary">
                              {occupation}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {participant.accommodations.map((accommodation) => (
                            <Badge key={accommodation} variant="outline">
                              {accommodation}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {participant.isActive ? (
                          <Badge variant="secondary">利用中</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            退所
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
