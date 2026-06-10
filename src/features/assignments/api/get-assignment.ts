import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Assignment } from "@/types/api";

export function getAssignment(id: string): Promise<Assignment> {
  return apiFetch(`/assignments/${id}`);
}

export const assignmentQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["assignments", id],
    queryFn: () => getAssignment(id),
  });

export function useAssignment(id: string) {
  return useQuery(assignmentQueryOptions(id));
}
