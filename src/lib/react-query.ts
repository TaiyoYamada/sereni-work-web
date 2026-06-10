import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api-client";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => {
          // 認証・認可・404 はリトライしない
          if (error instanceof ApiError && [401, 403, 404, 409, 422].includes(error.status)) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}
