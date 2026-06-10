import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { OptimizationRun, OptimizationSolver, OptimizationWeights } from "@/types/api";

export type CreateRunPayload = {
  participantIds: string[];
  companyIds: string[];
  periodStart: string;
  periodEnd: string;
  solver: OptimizationSolver;
  weights: OptimizationWeights;
  maxCandidates?: number;
};

export function createRun(input: CreateRunPayload): Promise<OptimizationRun> {
  return apiFetch("/optimization-runs", { method: "POST", body: JSON.stringify(input) });
}

export function useCreateRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRun,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["optimization-runs"] }),
  });
}
