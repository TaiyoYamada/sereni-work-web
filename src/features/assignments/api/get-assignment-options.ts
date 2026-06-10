import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Paginated } from "@/types/api";

type Option = { id: string; name: string };

/**
 * 割当フォームの選択肢（利用中の利用者・受け入れ中の企業）。
 * 他 feature の api を import せず（境界ルール）、この feature が必要とする形だけを取得する。
 * 100 件を超える運用になったら検索付きセレクトへ置き換える。
 */
export function useAssignmentOptions() {
  return useQuery({
    queryKey: ["assignments", "options"],
    queryFn: async () => {
      const [participants, companies] = await Promise.all([
        apiFetch<Paginated<Option>>("/participants?perPage=100&isActive=true"),
        apiFetch<Paginated<Option>>("/companies?perPage=100&isActive=true"),
      ]);
      return { participants: participants.data, companies: companies.data };
    },
  });
}
