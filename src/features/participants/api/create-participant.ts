import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Participant } from "@/types/api";

import type { ParticipantPayload } from "../schemas/participant";

export function createParticipant(input: ParticipantPayload): Promise<Participant> {
  return apiFetch("/participants", { method: "POST", body: JSON.stringify(input) });
}

export function useCreateParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createParticipant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["participants"] }),
  });
}
