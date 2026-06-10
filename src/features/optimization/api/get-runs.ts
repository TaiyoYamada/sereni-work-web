import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch, buildQuery } from "@/lib/api-client";
import type { OptimizationRun, Paginated } from "@/types/api";

export function getRuns(params: { page?: number } = {}): Promise<Paginated<OptimizationRun>> {
  return apiFetch(`/optimization-runs${buildQuery(params)}`);
}

export const runsQueryOptions = (params: { page?: number } = {}) =>
  queryOptions({
    queryKey: ["optimization-runs", params],
    queryFn: () => getRuns(params),
  });

export function useRuns(params: { page?: number } = {}) {
  return useQuery(runsQueryOptions(params));
}
