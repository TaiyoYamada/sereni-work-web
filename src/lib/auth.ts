import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Staff } from "@/types/api";

/**
 * ログイン中の職員情報（ロール）。
 * 全 feature が参照する横断関心事のため、feature ではなく lib に置く（bulletproof-react の lib/auth と同じ位置づけ）。
 */
export function getMe(): Promise<Staff> {
  return apiFetch<Staff>("/staff/me");
}

export const meQueryOptions = queryOptions({
  queryKey: ["me"],
  queryFn: getMe,
  staleTime: 5 * 60_000,
});

export function useMe() {
  return useQuery(meQueryOptions);
}
