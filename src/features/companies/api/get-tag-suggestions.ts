import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { TagSuggestions } from "@/types/api";

// participants 側にも同じ取得関数がある（feature 間 import 禁止のため小さな重複を許容。queryKey 共通でキャッシュは共有される）
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
