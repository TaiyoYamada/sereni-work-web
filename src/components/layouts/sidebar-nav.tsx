"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type SidebarNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** サイドバーのナビゲーション（項目は app 層から渡す。業務知識を持たない） */
export function SidebarNav({ appName, items }: { appName: string; items: SidebarNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="メインナビゲーション" className="flex h-full flex-col">
      <div className="flex h-14 items-center px-5 text-lg font-bold">{appName}</div>
      <ul className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  "focus-visible:ring-sidebar-ring focus-visible:ring-2 focus-visible:outline-none",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon aria-hidden className="size-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
