"use client";

import { useState } from "react";
import { Copy, KeyRound, UserPlus } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApiErrorMessage } from "@/hooks/use-api-error-message";
import type { Participant } from "@/types/api";

import type { ParticipantAccount } from "../api/issue-account";
import { useIssueParticipantAccount } from "../api/issue-account";
import { useResetParticipantAccountPassword } from "../api/reset-account-password";

function CredentialRow({ label, value }: { label: string; value: string }) {
  async function copy() {
    await navigator.clipboard.writeText(value);
    toast.success(`${label}をコピーしました`);
  }

  return (
    <div className="grid grid-cols-3 items-center gap-2 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 flex items-center justify-between gap-2">
        <code className="font-mono break-all select-all">{value}</code>
        <Button variant="ghost" size="icon-sm" onClick={copy} aria-label={`${label}をコピー`}>
          <Copy aria-hidden className="size-4" />
        </Button>
      </dd>
    </div>
  );
}

/** 発行結果ダイアログ。閉じると初期パスワードは二度と表示できない */
function CredentialsDialog({
  account,
  onClose,
}: {
  account: ParticipantAccount | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={account !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>アカウント情報</DialogTitle>
          <DialogDescription>
            ログイン ID と初期パスワードを利用者へ渡してください。
            <strong className="text-foreground">
              この画面を閉じると初期パスワードは再表示できません。
            </strong>
            必要な場合はパスワードを再発行してください。
          </DialogDescription>
        </DialogHeader>
        {account ? (
          <dl className="divide-y">
            <CredentialRow label="ログイン ID" value={account.loginId} />
            <CredentialRow label="初期パスワード" value={account.initialPassword} />
          </dl>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            確認して閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 利用者のアカウント発行・初期パスワード再発行カード。
 * ボタンの出し分けは UX のためだけに行い、認可の最終判定は API 側にある。
 */
export function ParticipantAccountCard({
  participant,
  canManage,
}: {
  participant: Participant;
  canManage: boolean;
}) {
  const errorMessage = useApiErrorMessage();
  const issueMutation = useIssueParticipantAccount(participant.id);
  const resetMutation = useResetParticipantAccountPassword(participant.id);
  const [issuedAccount, setIssuedAccount] = useState<ParticipantAccount | null>(null);

  async function run(action: () => Promise<ParticipantAccount>) {
    try {
      setIssuedAccount(await action());
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">アカウント</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="divide-y">
          <div className="grid grid-cols-3 gap-2 py-2 text-sm">
            <dt className="text-muted-foreground">状態</dt>
            <dd className="col-span-2">
              {participant.hasAccount ? (
                <Badge variant="secondary">発行済み</Badge>
              ) : (
                <Badge variant="outline">未発行</Badge>
              )}
            </dd>
          </div>
          {participant.loginId ? (
            <div className="grid grid-cols-3 gap-2 py-2 text-sm">
              <dt className="text-muted-foreground">ログイン ID</dt>
              <dd className="col-span-2">
                <code className="font-mono break-all select-all">{participant.loginId}</code>
              </dd>
            </div>
          ) : null}
        </dl>

        {canManage ? (
          <div className="flex flex-wrap gap-2">
            {participant.hasAccount ? (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button variant="outline" disabled={resetMutation.isPending}>
                      <KeyRound aria-hidden className="size-4" />
                      パスワードを再発行
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>パスワードを再発行しますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                      現在のパスワードは使えなくなり、新しい初期パスワードが発行されます。利用者へ新しいパスワードを渡してください。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction onClick={() => run(() => resetMutation.mutateAsync())}>
                      再発行する
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button disabled={issueMutation.isPending}>
                      <UserPlus aria-hidden className="size-4" />
                      アカウントを発行
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>アカウントを発行しますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                      iOS アプリへログインするためのログイン ID
                      と初期パスワードを発行します。メールアドレスが未登録の場合はログイン ID
                      を自動生成します。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction onClick={() => run(() => issueMutation.mutateAsync())}>
                      発行する
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        ) : null}
      </CardContent>

      <CredentialsDialog account={issuedAccount} onClose={() => setIssuedAccount(null)} />
    </Card>
  );
}
