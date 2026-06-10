import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/config/env";

/** ブラウザ用 Supabase クライアント（認証のみに使用。業務データは Hono API 経由） */
export function createClient() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
