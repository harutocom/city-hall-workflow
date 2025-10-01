// app/api/auth/[...nextauth]/route.ts
// NextAuthの認証APIをカスタマイズ
import { authOptions } from "@/lib/nextauth";
import NextAuth from "next-auth/next";

// NextAuth.jsを初期化
const handler = NextAuth(authOptions);

// GETリクエストとPOSTリクエストを、同じhandlerで処理するようにエクスポート
export { handler as GET, handler as POST };
