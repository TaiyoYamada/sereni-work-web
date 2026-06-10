import type { ReactNode } from "react";

/**
 * 認証後画面の共通シェル。
 * 業務知識は持たない（ナビ項目・ユーザーメニューは app 層から渡す）。
 */
export function AppShell({
  sidebar,
  userMenu,
  children,
}: {
  sidebar: ReactNode;
  userMenu: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <aside className="bg-sidebar text-sidebar-foreground hidden w-60 shrink-0 flex-col md:flex">
        {sidebar}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-card flex h-14 items-center justify-end gap-2 border-b px-4 md:px-6">
          {userMenu}
        </header>
        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
