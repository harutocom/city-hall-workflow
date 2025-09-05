# 市役所 DX 推進プロジェクト：申請・承認システム

## 概要

現在紙で行われている市役所内の申請承認プロセスをデジタル化する Web アプリケーションです。
市役所職員の業務負担を軽減するだけでなく、申請内容をデータベースに蓄積することで、将来的な勤怠管理の最適化や働き方の分析に繋がるデータ基盤の構築を目指します。

---

## 主な機能

- **申請機能：** テンプレートを用いた簡単な休暇願の作成、ファイル添付、下書き保存
- **承認機能：** 承認ルートの可視化、差し戻し（コメント付き）
- **通知機能：** 申請・承認の各ステップで、関係者にメールで自動通知
- **管理機能：** 職員情報の管理、申請テンプレートのカスタマイズ

---

## 使用技術

- **フロントエンド & バックエンド:** [Next.js](https://nextjs.org/)
- **データベース:** [Neon](https://neon.tech/) (Serverless Postgres)
- **デプロイ:** [Vercel](https://vercel.com/)
- **パッケージマネージャー:** [pnpm](https://pnpm.io/)
- **UI/UX デザイン:** [Figma](https://www.figma.com/)
- **プロジェクト管理:** [Notion](https://www.notion.so/)

---

## ディレクトリ構成

```
city-hall-workflow/
├── app/
│   ├── (app)/              // ログイン後のメインページ
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── (auth)/             // 認証関連のページ
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── api/
│   │   └── ... (API)
│   ├── layout.tsx
│   └── page.tsx            // ログイン画面への誘導など
│
├── components/
│   ├── ui/
│   └── features/
│
├── lib/                    // データベースの接続設定ファイルなど
│   └── ...
│
├── hooks/
│   └── ...
│
├── types/                  // データの型など
│   └── ...
│
├── public/                 // 画像ファイルなど
│   └── ...
│
├── package.json
├── next.config.js
└── ... (その他の設定ファイル)
```

---

## 環境構築

このプロジェクトをローカル環境で動かすまでの手順です。

### 1. 前提条件

- [Node.js](https://nodejs.org/) (v18.17.0 or later)
- [pnpm](https://pnpm.io/installation)

### 2. リポジトリをクローン

プロジェクトファイルを置きたい階層に移動して以下のコマンドを実行します。

```bash
git clone https://github.com/harutocom/city-hall-workflow.git
```

### 3. 依存パッケージをインストール

プロジェクトディレクトリに移動して依存パッケージをインストールします。

```bash
cd city-hall-workflow
pnpm install
```

### 4. 環境変数を設定

プロジェクトのルートディレクトリに`env.local`ファイルを作成し、必要な環境変数を設定します。

### 5. 開発サーバーを起動

以下のコマンドで開発サーバーを起動します。

```bash
pnpm dev
```

ブラウザで`http://localhost:3000`を開いてください。

---

## コミットメッセージのルール

### type の種類

| type   | 説明                         | 例                            |
| ------ | ---------------------------- | ----------------------------- |
| feat   | 新しい機能の追加             | feat: ユーザ登録機能追加      |
| fix    | バグ修正                     | fix: ログイン画面の不具合修正 |
| design | デザインの修正               | design: ボタンの色を変更      |
| docs   | ドキュメントの変更           | docs: README を更新           |
| chore  | その他の雑務（環境設定など） | chore: パッケージ更新         |

---

## ブランチ命名ルール

### type の種類

| type   | 説明                   | 例                        |
| ------ | ---------------------- | ------------------------- |
| feat   | 新機能追加             | feat/user-authentication  |
| fix    | バグ修正               | fix/login-bug             |
| design | デザイン修正           | design/header-redesign    |
| docs   | ドキュメント変更       | docs/update-readme        |
| chore  | その他（環境設定など） | chore/update-dependencies |
