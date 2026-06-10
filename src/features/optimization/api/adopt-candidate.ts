import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { OptimizationRun } from "@/types/api";

export function adoptCandidate({
  runId,
  candidateIndex,
}: {
  runId: string;
  candidateIndex: number;
}): Promise<OptimizationRun> {
  return apiFetch(`/optimization-runs/${runId}/adopt`, {
    method: "POST",
    body: JSON.stringify({ candidateIndex }),
  });
}

export function useAdoptCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adoptCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["optimization-runs"] });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}
