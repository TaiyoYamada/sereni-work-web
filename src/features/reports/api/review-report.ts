import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Report } from "@/types/api";

export type ReviewReportInput = {
  id: string;
  result: "REVIEWED" | "NEEDS_ACTION";
  interviewNeeded?: boolean;
};

export function reviewReport({ id, ...body }: ReviewReportInput): Promise<Report> {
  return apiFetch(`/reports/${id}/review`, { method: "POST", body: JSON.stringify(body) });
}

export function useReviewReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewReport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });
}
