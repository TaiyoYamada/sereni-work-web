import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch, buildQuery } from "@/lib/api-client";
import type { Paginated, Report, ReportStatus } from "@/types/api";

export type ListReportsParams = {
  page?: number;
  perPage?: number;
  status?: ReportStatus;
  participantId?: string;
  assignmentId?: string;
  from?: string;
  to?: string;
  interviewNeeded?: boolean;
};

export function getReports(params: ListReportsParams = {}): Promise<Paginated<Report>> {
  return apiFetch(`/reports${buildQuery(params)}`);
}

export const reportsQueryOptions = (params: ListReportsParams = {}) =>
  queryOptions({
    queryKey: ["reports", params],
    queryFn: () => getReports(params),
  });

export function useReports(params: ListReportsParams = {}) {
  return useQuery(reportsQueryOptions(params));
}
