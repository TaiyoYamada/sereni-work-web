import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Dashboard } from "@/types/api";

export function getDashboard(): Promise<Dashboard> {
  return apiFetch("/dashboard");
}

export const dashboardQueryOptions = () =>
  queryOptions({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

export function useDashboard() {
  return useQuery(dashboardQueryOptions());
}
