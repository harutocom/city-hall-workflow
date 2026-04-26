# 市役所 DX 推進プロジェクト：申請・承認ワークフローシステム

## 概要

市役所内で紙により行われていた申請・承認業務をデジタル化する Web アプリケーションです。
休暇申請などのワークフローを電子化し、申請内容や承認履歴をデータベースに蓄積することで、将来的な勤怠管理・業務分析の基盤構築を目指しています。

---

## 主な機能

| 機能 | 詳細 |
|------|------|
| **認証** | メールアドレス＋パスワードによるログイン（NextAuth.js / JWT） |
| **ダッシュボード** | 申請中件数・承認待ち件数・残有給時間をリアルタイム表示 |
| **申請** | テンプレートを選んでフォーム入力 → 下書き保存または提出 |
| **承認** | 多段階承認ルート・差し戻し（コメント付き）・承認ログ記録 |
| **有給自動減算** | テンプレートの設定に応じて、最終承認時に残有給時間を自動計算・減算 |
| **テンプレートビルダー** | 3ペインUI（パレット・キャンバス・設定）でフォームをノーコード作成 |
| **ユーザー管理** | 職員の追加・編集・無効化（ソフトデリート）・権限管理 |
| **パスワード変更** | ログイン中の職員が自分のパスワードを変更可能 |

---

## 技術スタック

| 領域 | 技術 |
|------|------|
| フレームワーク | [Next.js 16](https://nextjs.org/) (App Router) + React 19 |
| 言語 | TypeScript 5 |
| データベース | [Neon](https://neon.tech/) (Serverless PostgreSQL) |
| ORM | [Prisma 6](https://www.prisma.io/) |
| 認証 | [NextAuth.js v4](https://next-auth.js.org/) (Credentials Provider) |
| バリデーション | [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/) |
| スタイル | [Tailwind CSS v4](https://tailwindcss.com/) |
| テスト | [Vitest 4](https://vitest.dev/) |
| パッケージ管理 | [pnpm](https://pnpm.io/) |
| デプロイ | [Vercel](https://vercel.com/) |

---

## ディレクトリ構成

```
city-hall-workflow/
├── app/
│   ├── (app)/                        # ログイン後の画面（middleware で保護）
│   │   ├── home/
│   │   │   ├── page.tsx              # ダッシュボード
│   │   │   ├── application/
│   │   │   │   ├── page.tsx          # 申請履歴一覧
│   │   │   │   ├── new/              # テンプレート選択
│   │   │   │   │   └── [templateId]/ # 申請フォーム入力
│   │   │   │   ├── draft/            # 下書き一覧
│   │   │   │   ├── pending/          # 申請中一覧
│   │   │   │   └── [id]/             # 申請詳細
│   │   │   │       └── edit/         # 申請編集
│   │   │   └── approvals/
│   │   │       ├── page.tsx          # 承認待ち一覧
│   │   │       └── [id]/             # 承認詳細・承認/差し戻し操作
│   │   └── settings/
│   │       ├── page.tsx              # アカウント設定（ログアウト含む）
│   │       ├── changePassword/       # パスワード変更
│   │       ├── users/                # ユーザー管理（MANAGE_USERS 権限必要）
│   │       │   ├── signup/           # ユーザー追加
│   │       │   └── [id]/             # ユーザー詳細・編集
│   │       └── templates/            # テンプレート管理（MANAGE_TEMPLATES 権限必要）
│   │           ├── create/           # テンプレートビルダー
│   │           └── [id]/
│   │               └── edit/         # テンプレート編集
│   ├── (auth)/
│   │   └── login/                    # ログイン画面
│   ├── api/
│   │   ├── applications/[id]/        # GET / PATCH / DELETE
│   │   ├── approvals/[id]/           # GET / PATCH（承認・差し戻し）
│   │   ├── auth/
│   │   │   ├── signup/               # POST（管理者のみ）
│   │   │   └── [...nextauth]/        # NextAuth ハンドラ
│   │   ├── me/remaining-leave/       # GET（自分の残有給時間）
│   │   ├── templates/[id]/           # GET / PUT / DELETE
│   │   └── users/[id]/               # GET / PATCH / DELETE
│   └── layout.tsx
│
├── actions/
│   └── user.ts                       # Server Actions（ユーザー作成・パスワード変更）
│
├── components/
│   ├── features/
│   │   ├── applications/
│   │   │   ├── ApplicationListTable.tsx   # 申請一覧共通テーブル
│   │   │   ├── ApplicationDetailViewer.tsx
│   │   │   └── ApprovalRouteVisualizer.tsx
│   │   └── templates-bilder/
│   │       ├── FormBuilderCanvas.tsx      # テンプレートキャンバス
│   │       ├── FormComponentPalette.tsx   # パーツパレット
│   │       ├── SettingsPanel.tsx          # 設定パネル
│   │       └── TemplateMetadataForm.tsx
│   └── ui/
│
├── lib/
│   ├── constants.ts                  # DEPARTMENTS / ROLES / PERMISSIONS 定数
│   ├── db.ts                         # Prisma クライアント
│   ├── nextauth.ts                   # NextAuth 設定
│   └── utils.ts
│
├── schemas/
│   ├── application.ts                # Zod スキーマ
│   ├── template.ts
│   └── user.ts
│
├── types/
│   ├── next-auth.d.ts                # NextAuth 型拡張（permission_ids 等）
│   └── template.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── __tests__/
│   ├── schemas/
│   │   ├── application.test.ts       # ApplicationCreateSchema のテスト
│   │   ├── user.test.ts              # UserCreateSchema / UserPasswordChangeSchema のテスト
│   │   └── template.test.ts         # TemplateSchema のテスト
│   ├── lib/
│   │   └── constants.test.ts        # ROLES / DEPARTMENTS / PERMISSIONS のテスト
│   └── api/
│       ├── auth/
│       │   └── signup.test.ts        # サインアップ認証ガードのテスト
│       └── users/
│           └── id.test.ts            # ユーザーAPI HTTPステータスのテスト
│
├── vitest.config.ts                  # Vitest 設定
├── middleware.ts                     # 認証・認可ミドルウェア
└── package.json
```

---

## 権限設計

ユーザーには以下の権限を複数付与できます。ミドルウェアとAPI両方でチェックされます。

| 権限名 | ID | 内容 |
|--------|----|------|
| システム管理者 | 1 | 全権限 |
| テンプレート管理 | 2 | テンプレートの作成・編集・削除 |
| ユーザー管理 | 3 | ユーザーの追加・編集・無効化 |
| 全申請閲覧 | 4 | 他ユーザーの申請を閲覧（未実装） |

---

## 承認フロー

```
申請者
  └─ 申請作成（status: draft）
  └─ 提出（status: pending）
        │
        ▼
  承認者 Step 1（PENDING → APPROVED）
        │ 差し戻し → status: remanded（申請者が再編集・再提出）
        ▼
  承認者 Step 2（PENDING → APPROVED）
        │
        ▼
  全ステップ承認完了 → status: approved
  ※ auto_deduct_leave=true のテンプレートの場合、残有給時間を自動減算
```

---

## 環境構築

### 前提条件

- Node.js v18.17.0 以上
- pnpm

```bash
npm install -g pnpm
```

### セットアップ手順

```bash
# 1. リポジトリのクローン
git clone https://github.com/harutocom/city-hall-workflow.git
cd city-hall-workflow

# 2. 依存パッケージのインストール
pnpm install

# 3. 環境変数の設定
#    プロジェクトルートに .env ファイルを作成し以下を設定する
```

**.env に必要な環境変数**

```env
DATABASE_URL="postgresql://..."   # Neon 接続文字列（プールあり）
DIRECT_URL="postgresql://..."     # Neon 接続文字列（プールなし）
NEXTAUTH_SECRET="..."             # 任意のランダム文字列
NEXTAUTH_URL="http://localhost:3000"
```

```bash
# 4. Prisma Client の生成
pnpm prisma generate

# 5. （任意）シードデータの投入
pnpm prisma db seed

# 6. 開発サーバーの起動
pnpm dev
```

ブラウザで `http://localhost:3000` を開いてください。

---

## テスト

[Vitest](https://vitest.dev/) によるユニット・結合テストを提供しています。DB や外部サービスへの接続は不要です。

```bash
# 全テストを1回実行
pnpm test

# ファイル変更を監視しながら実行（開発時）
pnpm test:watch

# カバレッジレポートを生成
pnpm test:coverage
```

### テスト対象

| ファイル | 対象 |
|---|---|
| `__tests__/schemas/application.test.ts` | 申請作成スキーマのバリデーション |
| `__tests__/schemas/user.test.ts` | ユーザー作成・更新・パスワード変更スキーマ |
| `__tests__/schemas/template.test.ts` | テンプレートスキーマのバリデーション |
| `__tests__/lib/constants.test.ts` | 部署・役職・権限マスタの整合性 |
| `__tests__/api/auth/signup.test.ts` | サインアップAPIの認証ガード（権限チェック） |
| `__tests__/api/users/id.test.ts` | ユーザーAPIの HTTP ステータスコード |

---

## コミットメッセージのルール

| type | 説明 | 例 |
|------|------|----|
| `feat` | 新機能の追加 | `feat: 承認ルート設定機能を追加` |
| `fix` | バグ修正 | `fix: 申請API のステータスコードを修正` |
| `design` | デザインの修正 | `design: ダッシュボードカードのレイアウト調整` |
| `docs` | ドキュメントの変更 | `docs: README を更新` |
| `chore` | その他（環境設定など） | `chore: パッケージを更新` |

---

## ブランチ命名ルール

| type | 説明 | 例 |
|------|------|----|
| `feat` | 新機能追加 | `feat/multi-step-approval` |
| `fix` | バグ修正 | `fix/api-status-code` |
| `design` | デザイン修正 | `design/dashboard-layout` |
| `docs` | ドキュメント変更 | `docs/update-readme` |
| `chore` | その他 | `chore/update-dependencies` |
