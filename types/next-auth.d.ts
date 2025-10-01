// /types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // session.user の型を拡張
  interface Session {
    user?: {
      id: String; // NextAuthではuser.idはstring型で扱われる
      permission_ids: number[];
      department_id?: number;
      role_id?: number;
    } & DefaultSession["user"]; // name/email/image は残す
  }

  // User オブジェクトを拡張
  interface User {
    id: String;
    permission_ids: number[];
    department_id?: number;
    role_id?: number;
  }
}

// JWT の型拡張
declare module "next-auth/jwt" {
  interface JWT {
    id: String;
    permission_ids: number[];
    department_id?: number;
    role_id?: number;
  }
}
