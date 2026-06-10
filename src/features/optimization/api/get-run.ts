import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { OptimizationRun } from "@/types/api";

export function getRun(id: string): Promise<OptimizationRun> {
  return apiFetch(`/optimization-runs/${id}`);
}

export const runQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["optimization-runs", id],
    queryFn: () => getRun(id),
  });

export function useRun(id: string) {
  return useQuery(runQueryOptions(id));
}
