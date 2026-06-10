import { AppLayoutClient } from "./layout-client";

// 認証ガードは src/proxy.ts（未ログインは /login へリダイレクト）。
// ここではレイアウトの合成のみを行う。
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
