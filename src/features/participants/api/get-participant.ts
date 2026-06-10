import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Participant } from "@/types/api";

export function getParticipant(id: string): Promise<Participant> {
  return apiFetch(`/participants/${id}`);
}

export const participantQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["participants", id],
    queryFn: () => getParticipant(id),
  });

export function useParticipant(id: string) {
  return useQuery(participantQueryOptions(id));
}
