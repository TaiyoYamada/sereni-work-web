import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch, buildQuery } from "@/lib/api-client";
import type { Company, Paginated } from "@/types/api";

export type ListCompaniesParams = {
  page?: number;
  perPage?: number;
  q?: string;
  isActive?: boolean;
};

export function getCompanies(params: ListCompaniesParams = {}): Promise<Paginated<Company>> {
  return apiFetch(`/companies${buildQuery(params)}`);
}

export const companiesQueryOptions = (params: ListCompaniesParams = {}) =>
  queryOptions({
    queryKey: ["companies", params],
    queryFn: () => getCompanies(params),
  });

export function useCompanies(params: ListCompaniesParams = {}) {
  return useQuery(companiesQueryOptions(params));
}
