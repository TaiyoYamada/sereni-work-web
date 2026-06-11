"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useListParams } from "@/hooks/use-list-params";

/**
 * サーバーソート用の列ヘッダー。クリックで 昇順 → 降順 → 解除（既定順）を巡回し、
 * 状態は URL（sort / order）に保持する。
 */
export function SortHeader({ field, children }: { field: string; children: React.ReactNode }) {
  const { get, setFilters } = useListParams();
  const isActive = get("sort") === field;
  const order = isActive ? (get("order") ?? "asc") : undefined;

  function cycle() {
    if (!isActive) {
      setFilters({ sort: field, order: "asc" });
    } else if (order === "asc") {
      setFilters({ sort: field, order: "desc" });
    } else {
      setFilters({ sort: undefined, order: undefined });
    }
  }

  const Icon = order === "asc" ? ArrowUp : order === "desc" ? ArrowDown : ChevronsUpDown;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2.5 h-8"
      onClick={cycle}
      aria-label={`${typeof children === "string" ? children : "この列"}で並び替え`}
      aria-sort={order === "asc" ? "ascending" : order === "desc" ? "descending" : undefined}
    >
      {children}
      <Icon aria-hidden className={`size-3.5 ${isActive ? "" : "text-muted-foreground"}`} />
    </Button>
  );
}
