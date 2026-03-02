// middleware.ts

// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// 権限IDのマッピング
const PERMISSIONS = {
  SYSTEM_ADMIN: 1,
  MANAGE_TEMPLATES: 2,
  MANAGE_USERS: 3,
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // セッションから権限ID配列を取得（権限を持たない場合は空配列）
    const permissionIds = (token?.permission_ids as number[]) || [];
    const isSysAdmin = permissionIds.includes(PERMISSIONS.SYSTEM_ADMIN);

    // --- 1. ユーザー管理の認可 ---
    const isUserEditPath =
      pathname === "/settings/users/signup" ||
      /^\/settings\/users\/\d+$/.test(pathname);
    const canManageUsers =
      isSysAdmin || permissionIds.includes(PERMISSIONS.MANAGE_USERS);

    if (isUserEditPath && !canManageUsers) {
      return NextResponse.redirect(new URL("/settings", req.url));
    }

    // --- 2. テンプレート管理の認可 ---
    const isTemplateEditPath =
      pathname === "/settings/templates/create" ||
      /^\/settings\/templates\/\d+\/edit$/.test(pathname);
    const canManageTemplates =
      isSysAdmin || permissionIds.includes(PERMISSIONS.MANAGE_TEMPLATES);

    if (isTemplateEditPath && !canManageTemplates) {
      return NextResponse.redirect(new URL("/settings", req.url));
    }

    // どの制限にも該当しない場合はアクセスを許可
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // 未ログインユーザーは弾く（現在のコードの機能と同じ）
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/home/:path*", "/settings/:path*"],
};
// // NextAuth.jsのミドルウェアを使用して、特定のルートへのアクセスを保護

// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   callbacks: {
//     authorized: ({ token }) => {
//       return !!token;
//     },
//   },
// });

// export const config = {
//   matcher: [
//     // 保護したいルートを指定
//     "/home/:path*",
//     "/settings/:path*",
//   ],
// };
