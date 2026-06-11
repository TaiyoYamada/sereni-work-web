import { useMutation } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";

import type { ParticipantAccount } from "./issue-account";

export function resetParticipantAccountPassword(id: string): Promise<ParticipantAccount> {
  return apiFetch(`/participants/${id}/account/reset-password`, { method: "POST" });
}

export function useResetParticipantAccountPassword(id: string) {
  return useMutation({
    mutationFn: () => resetParticipantAccountPassword(id),
  });
}
