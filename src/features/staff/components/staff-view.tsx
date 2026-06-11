"use client";

import { MailPlus, Search } from "lucide-react";
import { toast } from "sonner";

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
import { useApiErrorMessage } from "@/hooks/use-api-error-message";
import { useListParams } from "@/hooks/use-list-params";
import { useMe } from "@/lib/auth";
import type { Staff } from "@/types/api";

import { useStaff } from "../api/get-staff";
import { useInviteStaff } from "../api/invite-staff";
import { roleLabel } from "../schemas/staff";
import { StaffFormDialog } from "./staff-form-dialog";

function AccountStatusBadge({ member }: { member: Staff }) {
  if (member.hasAccount) return <Badge variant="secondary">発行済み</Badge>;
  return (
    <Badge variant="outline" className="text-muted-foreground">
      未発行
    </Badge>
  );
}

export function StaffView() {
  const { page, q, setFilter, setPage } = useListParams();
  const { data: me } = useMe();
  const { data, isPending } = useStaff({ page, q: q || undefined });
  const errorMessage = useApiErrorMessage();
  const inviteMutation = useInviteStaff();

  const isAdmin = me?.role === "admin";

  async function sendInvite(member: Staff) {
    try {
      await inviteMutation.mutateAsync(member.id);
      toast.success(`${member.name}さんへ招待メールを送りました`);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="職員"
        description="職員アカウントの登録・招待・権限を管理します"
        actions={isAdmin ? <StaffFormDialog /> : undefined}
      />

      <div className="relative max-w-sm">
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
                  <TableHead>メールアドレス</TableHead>
                  <TableHead>ロール</TableHead>
                  <TableHead>状態</TableHead>
                  <TableHead>アカウント</TableHead>
                  {isAdmin ? <TableHead className="w-44">操作</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isAdmin ? 6 : 5}
                      className="text-muted-foreground h-24 text-center"
                    >
                      職員が見つかりません
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{roleLabel(member.role)}</TableCell>
                      <TableCell>
                        {member.isActive ? (
                          <Badge variant="secondary">有効</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            停止
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <AccountStatusBadge member={member} />
                      </TableCell>
                      {isAdmin ? (
                        <TableCell>
                          {member.isActive && !member.hasAccount ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={inviteMutation.isPending}
                              onClick={() => sendInvite(member)}
                            >
                              <MailPlus aria-hidden className="size-4" />
                              招待メールを送る
                            </Button>
                          ) : null}
                          {/* 初回ログイン前の招待紛失に備える。ログイン済みの職員には API が CONFLICT を返す */}
                          {member.isActive && member.hasAccount ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={inviteMutation.isPending}
                              onClick={() => sendInvite(member)}
                            >
                              <MailPlus aria-hidden className="size-4" />
                              招待を再送
                            </Button>
                          ) : null}
                        </TableCell>
                      ) : null}
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
