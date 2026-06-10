import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Company } from "@/types/api";

import type { CompanyPayload } from "../schemas/company";

type UpdateCompanyInput = Partial<CompanyPayload> & { isActive?: boolean };

export function updateCompany(id: string, input: UpdateCompanyInput): Promise<Company> {
  return apiFetch(`/companies/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function useUpdateCompany(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCompanyInput) => updateCompany(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}
