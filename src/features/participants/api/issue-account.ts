import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";

/** 発行・再発行の結果。initialPassword はこのレスポンスでのみ取得でき、再表示できない */
export type ParticipantAccount = {
  loginId: string;
  initialPassword: string;
};

export function issueParticipantAccount(id: string): Promise<ParticipantAccount> {
  return apiFetch(`/participants/${id}/account`, { method: "POST" });
}

export function useIssueParticipantAccount(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => issueParticipantAccount(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["participants"] }),
  });
}
