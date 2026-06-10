import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { ReportComment } from "@/types/api";

export function addComment({ id, body }: { id: string; body: string }): Promise<ReportComment> {
  return apiFetch(`/reports/${id}/comments`, { method: "POST", body: JSON.stringify({ body }) });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });
}
