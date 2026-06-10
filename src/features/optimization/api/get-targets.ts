import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { Paginated } from "@/types/api";

type ParticipantTarget = { id: string; name: string; desiredOccupations: string[] };
type CompanyTarget = { id: string; name: string; capacity: number };

/**
 * 対象選択用の利用者・企業（利用中・受け入れ中のみ）。
 * 他 feature の api を import しない（境界ルール）。
 */
export function useOptimizationTargets() {
  return useQuery({
    queryKey: ["optimization", "targets"],
    queryFn: async () => {
      const [participants, companies] = await Promise.all([
        apiFetch<Paginated<ParticipantTarget>>("/participants?perPage=100&isActive=true"),
        apiFetch<Paginated<CompanyTarget>>("/companies?perPage=100&isActive=true"),
      ]);
      return { participants: participants.data, companies: companies.data };
    },
  });
}
