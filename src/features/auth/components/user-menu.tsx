"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { paths } from "@/config/paths";
import { createClient } from "@/lib/supabase/client";
import type { StaffRole } from "@/types/api";

import { useMe } from "@/lib/auth";

const roleLabels: Record<StaffRole, string> = {
  admin: "管理者",
  staff: "支援員",
  viewer: "閲覧者",
};

export function UserMenu() {
  const t = useTranslations("nav");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me } = useMe();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    // 前のユーザーのサーバー状態を次のログインへ持ち越さない
    queryClient.clear();
    router.replace(paths.login);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="gap-2">
            <UserRound aria-hidden className="size-4" />
            <span>{me?.name ?? "…"}</span>
            {me ? (
              <span className="text-muted-foreground text-xs">{roleLabels[me.role]}</span>
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {me ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <span className="block text-sm font-medium">{me.name}</span>
              <span className="text-muted-foreground block text-xs">{me.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : null}
        {/* Base UI の Menu.Item に onSelect は無い（Radix と異なる）。onClick を使う */}
        <DropdownMenuItem onClick={logout}>
          <LogOut aria-hidden className="size-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
