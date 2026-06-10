import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Assignment } from "@/types/api";

export type CreateAssignmentPayload = {
  participantId: string;
  companyId: string;
  startDate: string;
  endDate: string;
  meetingPlace?: string;
  goal?: string;
};

export function createAssignment(input: CreateAssignmentPayload): Promise<Assignment> {
  return apiFetch("/assignments", { method: "POST", body: JSON.stringify(input) });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignments"] }),
  });
}
