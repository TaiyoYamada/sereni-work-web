import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Assignment } from "@/types/api";

/**
 * 割当の業務操作（確定・開始・完了・中止）。
 * ステータスの直接 PATCH はせず、必ず業務エンドポイントを呼ぶ（CLAUDE.md）。
 */

function useAssignmentAction(action: (id: string) => Promise<Assignment>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignments"] }),
  });
}

export function useConfirmAssignment() {
  return useAssignmentAction((id) => apiFetch(`/assignments/${id}/confirm`, { method: "POST" }));
}

export function useStartAssignment() {
  return useAssignmentAction((id) => apiFetch(`/assignments/${id}/start`, { method: "POST" }));
}

export function useCompleteAssignment() {
  return useAssignmentAction((id) => apiFetch(`/assignments/${id}/complete`, { method: "POST" }));
}

export function useCancelAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiFetch<Assignment>(`/assignments/${id}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignments"] }),
  });
}
