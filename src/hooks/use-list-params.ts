"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * 一覧の検索条件・ページ番号を URL（searchParams）に保持する共通フック。
 * 状態の正本は URL（SSOT）。リロード・共有しても同じ表示になる。
 */
export function useListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return {
    page: Number(searchParams.get("page") ?? 1),
    q: searchParams.get("q") ?? "",
    get: (key: string) => searchParams.get(key) ?? undefined,
    /** 検索条件の変更（ページは 1 に戻す） */
    setFilter: (key: string, value: string | undefined) =>
      setParams({ [key]: value, page: undefined }),
    setPage: (page: number) => setParams({ page: page <= 1 ? undefined : page }),
  };
}
