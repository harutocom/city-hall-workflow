// /types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // session.user の型を拡張
  interface Session {
    user?: {
      id: number;
      permission_ids: number[];
      department_id?: number;
      role_id?: number;
    } & DefaultSession["user"]; // name/email/image は残す
  }

  // User オブジェクトを拡張
  interface User {
    id: number;
    permission_ids: number[];
    department_id?: number;
    role_id?: number;
  }
}

// JWT の型拡張
declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    permission_ids: number[];
    department_id?: number;
    role_id?: number;
  }
}
