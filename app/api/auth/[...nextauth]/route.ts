// app/api/auth/[...nextauth]/route.ts
// 認証のAPI

import NextAuth from "next-auth/next";
import { AuthOptions } from "@/types/nextauth"; // カスタム型定義
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db"; // Prisma Client
import bcrypt from "bcrypt"; // パスワードのハッシュ化と比較

// NextAuth.jsの設定
export const authOptions: AuthOptions = {
  // 認証方法
  providers: [
    // 「メールアドレスとパスワード」による認証方法を設定
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // 認証ロジック本体
      async authorize(credentials) {
        // credentialsに、ユーザーが入力したemailとpasswordが入ってくる
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードが入力されていません。");
        }

        // Prismaを使って、DBからユーザーをメールアドレスで探す
        const user = await db.users.findUnique({
          where: { email: credentials.email },
        });

        // ユーザーが見つからない、またはパスワードが設定されていない場合は、認証失敗
        if (!user || !user.password_hash) {
          throw new Error("ユーザーが見つかりません。");
        }

        // bcryptを使って、入力されたパスワードと、DBのハッシュ化済みパスワードを比較
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        // パスワードが一致しなかった場合、認証失敗
        if (!isPasswordCorrect) {
          throw new Error("パスワードが間違っています。");
        }

        // ユーザーの権限情報を取得
        const permissions = await db.user_permissions.findMany({
          where: { user_id: user.id },
          select: { permission_id: true },
        });

        // 権限情報が見つからない場合、認証失敗
        if (!permissions || permissions.length === 0) {
          throw new Error("ユーザーの権限情報が見つかりません。");
        }

        // 認証成功！ JWTに渡すユーザー情報を返す
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          permission_ids: permissions.map((p) => p.permission_id),
          department_id: user.department_id,
          role_id: user.role_id,
        };
      },
    }),
  ],
  // ログイン状態をどう管理するか
  session: {
    strategy: "jwt",
  },
  // JWTやセッションに、カスタム情報を追加するための設定
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // userオブジェクトは、authorize関数から返されたもの
        token.id = user.id;
        token.permission_ids = user.permission_ids;
        token.department_id = user.department_id;
        token.role_id = user.role_id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.permission_ids = token.permission_ids;
        session.user.department_id = token.department_id;
        session.user.role_id = token.role_id;
      }
      return session;
    },
  },
  // NextAuth.jsが使う秘密鍵。 .envファイルで設定する
  secret: process.env.NEXTAUTH_SECRET,
  // ログインページのパスを指定
  pages: {
    signIn: "/login",
  },
};

// NextAuth.jsを初期化 as any で型チェックをスキップ
const handler = NextAuth(authOptions as any);

// GETリクエストとPOSTリクエストを、同じhandlerで処理するようにエクスポート
export { handler as GET, handler as POST };
