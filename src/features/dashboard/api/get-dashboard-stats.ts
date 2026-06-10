import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Paginated } from "@/types/api";

/**
 * ダッシュボードの集計。他 feature の api を import せず（境界ルール）、
 * 件数取得用に perPage=1 で meta.total のみを読む。
 */
async function countOf(path: string): Promise<number> {
  const result = await apiFetch<Paginated<unknown>>(path);
  return result.meta.total;
}

export type DashboardStats = {
  inProgress: number;
  confirmed: number;
  submitted: number;
  needsAction: number;
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async (): Promise<DashboardStats> => {
      const [inProgress, confirmed, submitted, needsAction] = await Promise.all([
        countOf("/assignments?perPage=1&status=IN_PROGRESS"),
        countOf("/assignments?perPage=1&status=CONFIRMED"),
        countOf("/reports?perPage=1&status=SUBMITTED"),
        countOf("/reports?perPage=1&status=NEEDS_ACTION"),
      ]);
      return { inProgress, confirmed, submitted, needsAction };
    },
  });
}
