// middleware.ts
// NextAuth.jsのミドルウェアを使用して、特定のルートへのアクセスを保護

import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    // 認可（authorization）のロジックをここに記述
    authorized: ({ token }) => {
      // !!token で、tokenがnullやundefinedでないこと（＝認証済みであること）を判定
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    // 保護したいルートを指定
    "/home/:path*",
    "/settings/:path*",
  ],
};
