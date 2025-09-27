// middleware.ts
// NextAuth.jsのミドルウェアを使用して、特定のルートへのアクセスを保護

import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
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
