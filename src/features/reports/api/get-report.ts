import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { ReportDetail } from "@/types/api";

export function getReport(id: string): Promise<ReportDetail> {
  return apiFetch(`/reports/${id}`);
}

export const reportQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["reports", id],
    queryFn: () => getReport(id),
  });

export function useReport(id: string) {
  return useQuery(reportQueryOptions(id));
}
