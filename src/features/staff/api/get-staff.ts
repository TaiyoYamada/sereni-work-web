import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch, buildQuery } from "@/lib/api-client";
import type { Paginated, Staff, StaffRole } from "@/types/api";

export type ListStaffParams = {
  page?: number;
  perPage?: number;
  q?: string;
  role?: StaffRole;
  isActive?: boolean;
};

export function getStaff(params: ListStaffParams = {}): Promise<Paginated<Staff>> {
  return apiFetch(`/staff${buildQuery(params)}`);
}

export const staffQueryOptions = (params: ListStaffParams = {}) =>
  queryOptions({
    queryKey: ["staff", params],
    queryFn: () => getStaff(params),
  });

export function useStaff(params: ListStaffParams = {}) {
  return useQuery(staffQueryOptions(params));
}
