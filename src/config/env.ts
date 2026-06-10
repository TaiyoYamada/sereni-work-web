import { z } from "zod";

const envSchema = z.object({
  /** Hono API のベース URL */
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:3001"),
  /** Supabase（ローカルは supabase start の値） */
  NEXT_PUBLIC_SUPABASE_URL: z.url().default("http://localhost:54321"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

// NEXT_PUBLIC_* はビルド時にインライン化されるため、必ず個別に参照する
export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
