import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Company } from "@/types/api";

import type { CompanyPayload } from "../schemas/company";

export function createCompany(input: CompanyPayload): Promise<Company> {
  return apiFetch("/companies", { method: "POST", body: JSON.stringify(input) });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });
}
