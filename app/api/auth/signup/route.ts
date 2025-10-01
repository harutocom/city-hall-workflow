// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { AuthOptions } from "@/types/nextauth";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // 管理者のみがユーザー登録可能（コメントアウトしているのは、初回登録時に管理者ユーザーがいないため）
    // const session = await getServerSession(AuthOptions);
    // if (!session?.user?.is_admin) {
    //   return new NextResponse("権限がありません", { status: 403 });
    // }
    const body = await request.json();
    const { email, name, password, departmentId, roleId, permissionId } = body;

    // 必須項目が空の場合はエラー
    if (
      !email ||
      !name ||
      !password ||
      !departmentId ||
      !roleId ||
      !permissionId
    ) {
      return new NextResponse("必須項目が不足しています。", { status: 400 });
    }

    // 1. ユーザーが既に存在するかチェック
    const existingUser = await db.users.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      // 既に存在する場合は 409 Conflict エラーを返す
      return new NextResponse("ユーザーは既に存在しています。", {
        status: 409,
      });
    }

    // 2. パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. 新しいユーザーをデータベースに作成
    const user = await db.users.create({
      data: {
        email,
        name,
        password_hash: hashedPassword, // ハッシュ化したパスワードを保存
        departments: {
          connect: {
            // フロントから来るIDは文字列なので数値に変換
            id: parseInt(departmentId, 10),
          },
        },
        roles: {
          connect: {
            id: parseInt(roleId, 10),
          },
        },
        user_permissions: {
          create: {
            permissions: {
              connect: {
                id: parseInt(permissionId, 10),
              },
            },
          },
        },
      },
    });

    // 作成したユーザー情報を返す（パスワードは含めない）
    return NextResponse.json(user);
  } catch (error) {
    console.error("[REGISTRATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
