# デザインシステム

ミッション「やすらぎの創造 ― 違いを、力に ―」に基づく、穏やかで刺激の少ないデザイン。
**iOS アプリとレイアウトは統一しない**。統一するのはこのドキュメントのトークンとセマンティクス
（色・状態表現・アイコンの意味・文言トーン）。iOS 側の対応表は sereni-work-ios/docs/design-system.md。

## ブランドカラー（セージグリーン系）

| トークン | 値 | 用途 |
|---|---|---|
| `primary-50`  | `#F3F7F4` | 選択行・ホバー背景 |
| `primary-100` | `#E4EDE7` | バッジ背景・薄い強調 |
| `primary-200` | `#C9DBCF` | ボーダー強調 |
| `primary-300` | `#A7C4B1` | 非活性の強調要素 |
| `primary-500` | `#5C8A6F` | ブランド基準色（装飾用。白文字を載せない） |
| `primary-600` | `#4A7159` | **主ボタン・リンク・アクティブ状態**（白文字 AA 達成） |
| `primary-700` | `#3C5B48` | ボタン hover / pressed |
| `primary-900` | `#283D31` | 濃い見出し・サイドバー背景候補 |
| `accent`      | `#D9A441` | アンバー。バッジ獲得・ポジティブな強調のみ（多用しない） |
| `background`  | `#FAFAF7` | アプリ背景（オフホワイト。純白のまぶしさを避ける） |
| `surface`     | `#FFFFFF` | カード・テーブル背景 |
| `text`        | `#2D3330` | 基本テキスト（純黒は使わない） |
| `text-muted`  | `#5F6B64` | 補足テキスト（AA 達成の最薄グレー） |
| `border`      | `#E2E6E2` | 標準ボーダー |

## セマンティックカラー（文字として使う場合は白背景で AA 達成）

| トークン | 値 | 意味 |
|---|---|---|
| `success` | `#2F6B4F` | 完了・正常 |
| `info`    | `#2B6CB0` | 情報・確認待ち |
| `warning` | `#8A5A00` | 要注意（背景は `#FFF4DC`） |
| `danger`  | `#B3261E` | エラー・破壊的操作・中止 |
| `neutral` | `#6B7280` | 下書き・非活性 |

## 状態の表現（iOS と完全一致させる。色だけに依存せず必ずアイコン + ラベル併用）

### 実習割当

| 状態 | ラベル | 色 | Lucide アイコン |
|---|---|---|---|
| DRAFT | 下書き | neutral | `pencil` |
| PROPOSED | 提案中 | `#6D5BA8`（紫） | `sparkles` |
| CONFIRMED | 確定 | info | `calendar-check` |
| IN_PROGRESS | 実習中 | primary-600 | `circle-play` |
| COMPLETED | 完了 | success | `circle-check` |
| CANCELLED | 中止 | danger | `circle-x` |

### 日報

| 状態 | ラベル | 色 | Lucide アイコン |
|---|---|---|---|
| DRAFT | 下書き | neutral | `pencil` |
| SUBMITTED | 提出済み | info | `send` |
| REVIEWED | 確認済み | success | `badge-check` |
| NEEDS_ACTION | 要対応 | warning | `triangle-alert` |

## タイポグラフィ

- システムフォント（`system-ui` スタック）。和文はヒラギノ / Noto Sans JP / Yu Gothic にフォールバック
- サイズは Tailwind 標準スケール。本文 `text-sm`（14px）を業務画面の基準、最小 `text-xs`（12px）は補足のみ
- 数値カラム（人数・日数・スコア）は `tabular-nums` を必ず指定する

## 形・余白

- 角丸: 入力・ボタン 8px（`rounded-lg`）、カード 12px（`rounded-xl`）
- 余白: 4px グリッド。カード内パディング 16〜24px
- 影は弱く（`shadow-sm` 基準）。ボーダーで区切りを作り、影に頼らない
- ダークモードは当面非対応（ライト固定）。トークン経由で色を使い、直値を書かないこと

## アイコン

- Lucide（shadcn 標準）。iOS の SF Symbols と線の印象を揃える
- 同じ概念には同じアイコンを使い続ける: 実習=`briefcase` / 日報=`notebook-pen` / 体調=`heart-pulse` / 利用者=`users` / 企業=`building-2` / バッジ=`award` / 最適化提案=`sparkles`

## 文言トーン（職員向け）

- 業務用語で簡潔に。ただし利用者と共有する概念は iOS と同じ語を使う（「実習」「日報」「体調」「配慮」）
- 破壊的操作の確認は「何が起きるか」を具体的に書く（「割当を中止します。利用者への通知は送信されません」）
- エラーは原因 + 次の行動をセットで示す
