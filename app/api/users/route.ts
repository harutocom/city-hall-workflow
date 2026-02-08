// app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcrypt";
import { UserCreateSchema } from "@/schemas/user";
import { z } from "zod";

/**
 * ユーザー一覧を取得するAPI
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  // tokenの情報を取得
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 念のためtokenが存在するか(ログイン状態かどうか)を確認
  if (!token) {
    // tokenが無かったらエラーを返す
    return NextResponse.json({
      message: "ログインされていません。",
      status: 401,
    });
  }

  // 取得したtokenから必要な情報を変数へ代入
  const userId = token.id;
  const userPermissions = token.permission_ids; // userの権限の配列
  const targetPermission = 1; // テンプレート作成に必要な権限ID

  // userに権限があるかを確認
  if (!userPermissions.includes(targetPermission)) {
    // 権限が無い場合エラーを返す
    console.error(`status:403 ${userId}はユーザー一覧の閲覧権限がありません`);
    return NextResponse.json({
      message: "ユーザー一覧の閲覧権限がありません",
      status: 403,
    });
  }

  // 権限があればデータを取得
  try {
    const users = await db.users.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        department_id: true,
        departments: {
          select: {
            name: true,
          },
        },
        role_id: true,
        roles: {
          select: {
            name: true,
          },
        },
        created_at: true,
        updated_at: true,
        user_permissions: {
          select: {
            permissions: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        updated_at: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "usersデータの取得に失敗しました。" },
      { status: 500 },
    );
  }
}

/**
 * ユーザーを作成するAPI
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  // tokenの情報を取得
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 念のためtokenが存在するか(ログイン状態かどうか)を確認
  if (!token) {
    // tokenが無かったらエラーを返す
    return NextResponse.json(
      { message: "ログインされていません。" },
      { status: 401 },
    );
  }

  // 取得したtokenから必要な情報を変数へ代入
  const userId = token.id;
  const userPermissions = token.permission_ids; // userの権限の配列
  const targetPermission = 1; // テンプレート作成に必要な権限ID

  // userに権限があるかを確認
  if (!userPermissions.includes(targetPermission)) {
    // 権限が無い場合エラーを返す
    console.error(`status:403 ${userId}はユーザー作成の権限がありません`);
    return NextResponse.json(
      { message: "ユーザー作成の権限がありません" },
      { status: 403 },
    );
  }

  try {
    // データをフロントから取得
    const body = await request.json();

    // zodスキーマでバリデーションと型変換
    const validatedBody = UserCreateSchema.parse(body);

    // 分割代入でデータを取り出す
    const { email, name, password, departmentId, roleId, permissionId } =
      validatedBody;

    // 同じメールアドレスのuserが存在するかチェック
    const existingUser = await db.users.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      // 既に存在する場合は 409 Conflict エラーを返す
      const message = existingUser.deleted_at
        ? "このメールアドレスは過去に使用（無効化）されたため、再利用できません。"
        : "このメールアドレスは既に使用されています";
      return NextResponse.json({ message: message }, { status: 409 });
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // 新しいユーザーをデータベースに作成
    const user = await db.$transaction(async (tx) => {
      // 1. ユーザー本体を作成 (Zodと連携するシンプルな書き方)
      const createdUser = await tx.users.create({
        data: {
          email,
          name,
          password_hash: hashedPassword,
          department_id: departmentId, // スキーマに合わせてIDを直接渡す
          role_id: roleId, // スキーマに合わせてIDを直接渡す
        },
      });

      // 2. 権限を user_permissions (中間テーブル) に作成
      //    (将来、permission_ids(配列)になったら createMany に変えるだけ)
      await tx.user_permissions.create({
        data: {
          user_id: createdUser.id,
          permission_id: permissionId, // MVPの単一ID
        },
      });

      return createdUser;
    });

    // 作成したユーザー情報を返す（パスワードは含めない）
    const { password_hash, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // zodエラーの場合どこの入力でエラーかを返す
      console.warn("Zodバリデーション失敗:", error.issues);
      return NextResponse.json(
        {
          message: "入力データが無効です。",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }
    // zod以外のエラーの場合は普通にerrorを返す
    console.error("ユーザー作成中のエラー", error);
    console.error("[REGISTRATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
