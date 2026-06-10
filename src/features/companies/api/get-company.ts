import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Company } from "@/types/api";

export function getCompany(id: string): Promise<Company> {
  return apiFetch(`/companies/${id}`);
}

export const companyQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["companies", id],
    queryFn: () => getCompany(id),
  });

export function useCompany(id: string) {
  return useQuery(companyQueryOptions(id));
}
