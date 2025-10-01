// types/nextauth.ts
// NextAuth.jsの型定義をカスタマイズするためのファイル

// ユーザー情報の型定義
export interface User {
  id: number;
  email: string;
  name: string;
  permission_ids: number[];
  department_id?: number;
  role_id?: number;
}

// セッション情報の型定義
export interface Session {
  user: User;
}

// JWTの型定義(ログイン中に必要な情報を保持)
export interface JWT {
  id: number;
  permission_ids: number[];
  department_id?: number;
  role_id?: number;
}

// コールバック関数(必要な情報をJWTやセッションに追加する関数)の型定義
export interface AuthCallbacks {
  jwt?: (params: { token: JWT; user?: User }) => Promise<JWT> | JWT;
  session?: (params: {
    session: Session;
    token: JWT;
  }) => Promise<Session> | Session;
}

// ページの型定義(ログインページやエラーページなど)
export interface AuthPages {
  signIn?: string;
  signOut?: string;
  error?: string;
}

// NextAuth.jsの設定オプション全体の型定義
export interface AuthOptions {
  providers: any[];
  session?: {
    strategy?: "jwt" | "database";
    maxAge?: number;
  };
  callbacks?: AuthCallbacks;
  secret?: string;
  pages?: AuthPages;
}
