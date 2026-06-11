import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch, buildQuery } from "@/lib/api-client";
import type { Paginated, Participant } from "@/types/api";

export type ListParticipantsParams = {
  page?: number;
  perPage?: number;
  q?: string;
  assignedStaffId?: string;
  isActive?: boolean;
  /** 並び替えキー（name | createdAt。検証は API 側） */
  sort?: string;
  order?: string;
};

export function getParticipants(
  params: ListParticipantsParams = {},
): Promise<Paginated<Participant>> {
  return apiFetch(`/participants${buildQuery(params)}`);
}

export const participantsQueryOptions = (params: ListParticipantsParams = {}) =>
  queryOptions({
    queryKey: ["participants", params],
    queryFn: () => getParticipants(params),
  });

export function useParticipants(params: ListParticipantsParams = {}) {
  return useQuery(participantsQueryOptions(params));
}
