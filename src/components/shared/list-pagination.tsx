"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";

/** 一覧共通のページネーション（ページ番号は URL に保持する想定で onPageChange を受ける） */
export function ListPagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  if (meta.totalPages <= 1) return null;

  return (
    <nav aria-label="ページネーション" className="flex items-center justify-between">
      <p className="text-muted-foreground text-sm tabular-nums">
        全 {meta.total} 件中 {(meta.page - 1) * meta.perPage + 1}–
        {Math.min(meta.page * meta.perPage, meta.total)} 件
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft aria-hidden className="size-4" />
          前へ
        </Button>
        <span className="text-sm tabular-nums">
          {meta.page} / {meta.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          次へ
          <ChevronRight aria-hidden className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
