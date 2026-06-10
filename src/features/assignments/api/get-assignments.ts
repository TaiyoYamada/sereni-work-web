import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch, buildQuery } from "@/lib/api-client";
import type { Assignment, AssignmentStatus, Paginated } from "@/types/api";

export type ListAssignmentsParams = {
  page?: number;
  perPage?: number;
  participantId?: string;
  companyId?: string;
  status?: AssignmentStatus;
  from?: string;
  to?: string;
};

export function getAssignments(params: ListAssignmentsParams = {}): Promise<Paginated<Assignment>> {
  return apiFetch(`/assignments${buildQuery(params)}`);
}

export const assignmentsQueryOptions = (params: ListAssignmentsParams = {}) =>
  queryOptions({
    queryKey: ["assignments", params],
    queryFn: () => getAssignments(params),
  });

export function useAssignments(params: ListAssignmentsParams = {}) {
  return useQuery(assignmentsQueryOptions(params));
}
