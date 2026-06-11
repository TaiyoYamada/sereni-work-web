import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch, buildQuery } from "@/lib/api-client";
import type { Company, Paginated } from "@/types/api";

export type ListCompaniesParams = {
  page?: number;
  perPage?: number;
  q?: string;
  isActive?: boolean;
  /** 並び替えキー（name | capacity | createdAt。検証は API 側） */
  sort?: string;
  order?: string;
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
