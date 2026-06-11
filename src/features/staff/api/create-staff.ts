import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Staff } from "@/types/api";

import type { StaffPayload } from "../schemas/staff";

export function createStaff(input: StaffPayload): Promise<Staff> {
  return apiFetch("/staff", { method: "POST", body: JSON.stringify(input) });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }),
  });
}
