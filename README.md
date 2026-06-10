# sereni-work-web

セレニワーク 体験実習支援システムの職員用 Web アプリ。
管理者・支援員・閲覧者が、利用者情報・実習先企業・実習割当・日報・割当の自動提案を管理する。
業務データへのアクセスはすべて [sereni-work-api](../sereni-work-api) を経由する。

## 技術構成

| 領域 | 技術 |
|---|---|
| フレームワーク | Next.js（App Router）+ TypeScript |
| UI | Tailwind CSS + shadcn/ui（Base UI）・セージグリーンのデザイントークン |
| 状態 | TanStack Query（サーバー状態）/ React Hook Form + Zod（フォーム）/ URL（検索条件） |
| 認証 | Supabase Auth（@supabase/ssr） |
| デプロイ | Vercel |

アーキテクチャ（feature-based・依存方向ルール）は [CLAUDE.md](./CLAUDE.md) と [docs/](./docs/) を参照。

## 必要なもの

- [Bun](https://bun.sh)
- 起動済みのバックエンド（sereni-work-api リポジトリで `supabase start` + `bun run dev`）

## セットアップ

```bash
bun install
cp .env.example .env.local   # Supabase の anon key を設定
bun run dev                  # http://localhost:3000
```

ログインには Supabase Auth のユーザーと `staff` テーブルの紐付けが必要
（手順は sereni-work-api の README を参照）。

## 開発コマンド

| コマンド | 内容 |
|---|---|
| `bun run dev` | 開発サーバー |
| `bun run test` | ユニットテスト（Vitest + Testing Library） |
| `bun run e2e` | E2E テスト（Playwright。初回は `bunx playwright install chromium`） |
| `bun run lint` / `bun run format` | ESLint（feature 境界ルール含む）/ Prettier |
| `bun run typecheck` | 型チェック |
| `bun run build` | 本番ビルド |

## ディレクトリ構成

```
src/
  app/         # ルーティング（(auth) / (app) の route group）
  features/    # 機能単位（participants, companies, assignments, reports, ...）
  components/  # 共有 UI（ui = shadcn 管理ゾーン / layouts / shared）
  lib/         # api-client・Supabase クライアント・認証
  config/      # 環境変数（Zod 検証）・ルートパス定数
  i18n/        # next-intl（当面日本語のみ）
```

## ライセンス

本リポジトリは私的なソフトウェアです（All rights reserved）。詳細は [LICENSE](./LICENSE) を参照。
