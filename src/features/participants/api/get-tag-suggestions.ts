import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { TagSuggestions } from "@/types/api";

export function getTagSuggestions(): Promise<TagSuggestions> {
  return apiFetch("/tag-suggestions");
}

export const tagSuggestionsQueryOptions = () =>
  queryOptions({
    queryKey: ["tag-suggestions"],
    queryFn: getTagSuggestions,
  });

export function useTagSuggestions() {
  return useQuery(tagSuggestionsQueryOptions());
}
