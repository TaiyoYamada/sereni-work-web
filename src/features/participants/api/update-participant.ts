import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Participant } from "@/types/api";

import type { ParticipantPayload } from "../schemas/participant";

type UpdateParticipantInput = Partial<ParticipantPayload> & { isActive?: boolean };

export function updateParticipant(id: string, input: UpdateParticipantInput): Promise<Participant> {
  return apiFetch(`/participants/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function useUpdateParticipant(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateParticipantInput) => updateParticipant(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["participants"] }),
  });
}
