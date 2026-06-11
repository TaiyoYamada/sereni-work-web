import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Staff } from "@/types/api";

export function inviteStaff(id: string): Promise<Staff> {
  return apiFetch(`/staff/${id}/invite`, { method: "POST" });
}

export function useInviteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inviteStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}
