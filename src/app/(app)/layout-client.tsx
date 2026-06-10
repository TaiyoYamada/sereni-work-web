"use client";

import {
  Briefcase,
  Building2,
  LayoutDashboard,
  NotebookPen,
  Sparkles,
  UserCog,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { AppShell } from "@/components/layouts/app-shell";
import { SidebarNav, type SidebarNavItem } from "@/components/layouts/sidebar-nav";
import { paths } from "@/config/paths";
import { useMe } from "@/lib/auth";
import { UserMenu } from "@/features/auth/components/user-menu";

/** 認証後画面のレイアウト（app 層で features と shared を合成する） */
export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const { data: me } = useMe();

  const items: SidebarNavItem[] = [
    { href: paths.dashboard, label: t("dashboard"), icon: LayoutDashboard },
    { href: paths.participants.list, label: t("participants"), icon: Users },
    { href: paths.companies.list, label: t("companies"), icon: Building2 },
    { href: paths.assignments.list, label: t("assignments"), icon: Briefcase },
    { href: paths.optimization.list, label: t("optimization"), icon: Sparkles },
    { href: paths.reports.list, label: t("reports"), icon: NotebookPen },
    // 職員アカウント管理は管理者のみ表示（権限の本体は API 側）
    ...(me?.role === "admin" ? [{ href: paths.staff.list, label: t("staff"), icon: UserCog }] : []),
  ];

  return (
    <AppShell sidebar={<SidebarNav appName="セレニワーク" items={items} />} userMenu={<UserMenu />}>
      {children}
    </AppShell>
  );
}
