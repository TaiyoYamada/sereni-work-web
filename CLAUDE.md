# sereni-work-web

セレニワーク（就労移行支援事業所）の体験実習支援システムの Web アプリ。
管理者・支援員・閲覧者が利用する。利用者本人は iOS アプリを使う（このアプリは職員専用）。

## プロジェクト概要

- 利用者情報管理 / 実習先企業管理 / 日報確認 / 実習スケジュール管理 / 実習割当管理 / 割当自動提案 / 支援員評価 / 教材管理 / アカウント管理 / ダッシュボード
- 体験実習先の割当は最適化（量子アニーリング等）による自動提案を利用するが、**最終判断は支援員が行う**。提案理由・スコア内訳・制約違反を表示し、手動修正と最終確定ができる UI にする
- 支援員には数式の係数を直接入力させない。「希望を重視」「スキルを重視」「公平性を重視」など業務用語で重みを調整させる

## 技術構成

- Next.js（App Router）+ TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query（サーバー状態）
- React Hook Form（フォーム状態）
- Zod（入力値検証）
- next-intl（多言語）
- デプロイ先: Vercel

## 開発コマンド

パッケージマネージャーは bun。

- `bun run dev` — 開発サーバー
- `bun run lint` / `bun run lint:fix` — ESLint（feature 境界の依存方向ルールを含む）
- `bun run format` / `bun run format:check` — Prettier
- `bun run typecheck` — tsc --noEmit
- `bun run test` / `bun run test:watch` — Vitest + Testing Library
- `bun run e2e` — Playwright（初回は `bunx playwright install chromium`。事前に `bun run build` が必要）
- `bun run build` — 本番ビルド

このリポジトリは Docker 化しない。ローカルの DB / Auth と optimizer は api リポジトリ側で起動する（`supabase start` + `docker compose up optimizer`）。接続先 URL は .env で切り替える。

## Git 運用

- コミットは Conventional Commits + 日本語本文（例: `feat: 日報一覧画面を追加`）
- 接頭辞: feat / fix / refactor / docs / test / chore
- ブランチ: `feature/xxx` `fix/xxx`。main へ直接コミットしない

## ドキュメント

詳細仕様は必要になったときに docs/ を読む:

- `docs/requirements.md` — 画面・機能一覧（全9機能の詳細）
- `docs/accessibility.md` — アクセシビリティ要件と実装指針
- ロール別権限・API エラーコードの正は api リポジトリ（sereni-work-api/docs/）にある

## アーキテクチャ

Feature-based Architecture（bulletproof-react 準拠）。

```
src/
  app/         # ルーティング専用。ページは薄く保ち、features の View を呼ぶだけにする
               # [locale]/(auth)/ と [locale]/(app)/ の route group で認証前後のレイアウトを分ける
  features/    # ビジネスロジックの本体（12機能: auth, staff, participants, companies,
               #   internships, assignments, optimization, reports, evaluations,
               #   materials, notifications, dashboard）
  components/
    ui/        # shadcn/ui の CLI 管理ゾーン。業務コンポーネントを置かない・ファイル名を変えない
    layouts/   # app-shell, sidebar, header
    shared/    # 機能横断の共通部品（data-table, page-header, confirm-dialog 等）。業務知識を持たせない
  hooks/       # 汎用フック（use-debounce 等）
  lib/         # api-client.ts, react-query.ts, utils.ts(cn)
  config/      # env.ts（環境変数の Zod 検証）, paths.ts（ルートパス定数。URL をハードコードしない）
  i18n/        # next-intl（routing / request / navigation）
  stores/      # グローバル UI 状態（サイドバー開閉等、最小限）
  types/       # API 共通型（PaginatedResponse 等）
  testing/     # test-utils, MSW handlers
```

feature 内は必要なフォルダだけ作る（全 feature に同じフォルダを機械的に作らない）:

```
features/participants/
  api/         # TanStack Query 層。1操作=1ファイル
               #   get-participants.ts = fetch 関数 + queryOptions() + useParticipants()
               #   queryOptions を分離するのは RSC の prefetch と useQuery で共用するため
  components/  # participants-view.tsx（page.tsx から呼ぶページ実体）, participant-form.tsx 等
  hooks/       # use-participant-filters.ts（検索条件 ⇔ searchParams 同期）
  schemas/     # Zod スキーマ（フォームと Server Action で共用）
  types/
```

### 依存方向（ESLint の import/no-restricted-paths で強制する）

shared（components / hooks / lib / config / types）→ features → app の一方向のみ。

- **feature 間の import は禁止。** 横断が必要なら app 層（page / layout）で合成するか、共有層へ昇格させる
- page.tsx にロジックを書かない（prefetch + HydrationBoundary + View 呼び出しまで）
- `'use client'` はツリーの葉に近い位置に置き、layout や View 全体を client 化しない

### 命名

- ファイル名は kebab-case、コンポーネントは PascalCase の named export
- api ファイルは動詞-リソース形式: `get-participants.ts` / `create-participant.ts`
- barrel file（index.ts）を乱用しない。直接 import する

## 状態管理ルール

- サーバー状態は TanStack Query。独自のグローバルストアへ API レスポンスをコピーしない
- フォーム状態は React Hook Form + Zod resolver
- 検索条件・ページ番号・タブ等は可能な限り URL（searchParams）へ保持する

## API・データアクセス

- 業務データへのアクセスはすべて Hono API（sereni-work-api）経由。**Supabase PostgreSQL を直接読み書きしない**
- 認証は Supabase Auth。JWT を API リクエストへ付与する
- API のエラーコードは共通: `VALIDATION_ERROR` `UNAUTHENTICATED` `FORBIDDEN` `NOT_FOUND` `CONFLICT` `ASSIGNMENT_CAPACITY_EXCEEDED` `OPTIMIZATION_FAILED` `INTERNAL_ERROR`。コードごとにユーザー向け文言へ変換して表示する
- 一覧はページネーション前提で実装する
- 最適化実行は非同期（PENDING → RUNNING → SUCCEEDED / FAILED / CANCELLED）。実行中も他画面の操作を妨げないこと

## 権限（ロール）と UI

- 管理者: 全機能。職員アカウント管理・データ出力・監査ログ確認は管理者のみ
- 支援員: 閲覧 + 担当利用者の編集、日報コメント、評価入力、自動提案の実行、割当候補の確認・修正
- 閲覧者: 閲覧のみ。編集・削除・割当変更・データ出力の UI を出さない
- **ボタンの非表示は認可ではない。** 業務ルールと最終的な認可判定は Hono API 側にある。UI 側の出し分けは UX のためだけに行う

## 状態表示ルール

状態は API の定数をそのまま使い、任意の文字列を作らない。

- 実習割当: `DRAFT` / `PROPOSED` / `CONFIRMED` / `IN_PROGRESS` / `COMPLETED` / `CANCELLED`
- 日報: `DRAFT` / `SUBMITTED` / `REVIEWED` / `NEEDS_ACTION`

状態遷移は必ず業務エンドポイント（`/assignments/{id}/confirm` 等）を呼ぶ。ステータス値の直接 PATCH はしない。

## アクセシビリティ（基本設計に含める。後付けにしない）

- キーボードのみで全操作が完了すること。スクリーンリーダー対応・フォーカス管理・色だけに依存しない表現は必須
- 詳細な要件と実装指針は `docs/accessibility.md`

## 個人情報の扱い

- 氏名・日報本文・障害情報・配慮事項・メールアドレス・トークン類をログ（console / Sentry / Vercel Logs）へ出力しない
- URL クエリへ個人情報を載せない（ID のみ可）

## テスト方針

- Unit Test / Component Test: Vitest + React Testing Library
- E2E Test: Playwright
- Accessibility Test（axe 等によるチェックを Component / E2E に組み込む）
- ロールごとの表示・操作の出し分けをテストする

## 完了条件

- Lint / Format / Type Check / テストがすべて通ること
- 新規フォームには Zod スキーマと送信エラー処理があること
- 新規画面はキーボード操作とスクリーンリーダーで利用可能であること

## 禁止事項

- Supabase PostgreSQL を直接更新しない（読み取りも Hono API 経由とする）
- 権限判定をフロントエンドだけで行わない
- 日報本文や個人情報をログへ出力しない
- API 型を複数箇所で重複定義しない（API クライアント / スキーマから導出する）
- 状態を任意の文字列で管理しない
- 確定済み割当を UI から直接上書きする実装をしない
