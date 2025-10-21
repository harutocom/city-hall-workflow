// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserIdParamSchema } from "@/schemas/user";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  try {
    // パラメータからidを取得
    const { id } = await params;

    // 取得したidをzodスキーマを使い型検証と変換
    const { id: userId } = UserIdParamSchema.parse({ id });

    // userの詳細情報をDBから取得
    const user = await db.users.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        remaining_leave_hours: true,
        created_at: true,
        updated_at: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
        departments: {
          select: {
            id: true,
            name: true,
          },
        },
        user_permissions: {
          select: {
            permissions: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            permissions: {
              id: "asc",
            },
          },
        },
      },
    });

    // 詳細情報を取得できなかった場合エラーを返す
    if (!user) {
      return NextResponse.json(
        { message: "指定されたユーザーは見つかりませんでした。" },
        { status: 404 }
      );
    }

    // 取得結果を返す
    return NextResponse.json({ user });
  } catch (error) {
    // 起こったエラーがzodのものかどうか
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
        { status: 400 }
      );
    }
    // エラーが起きたらログを表示
    console.error(error);

    return NextResponse.json(
      { message: "ユーザーの詳細データ取得に失敗しました。" },
      { status: 500 }
    );
  }
}

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;

//   // tokenの情報を取得
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   // 念のためtokenが存在するか(ログイン状態かどうか)を確認
//   if (!token) {
//     // tokenが無かったらエラーを返す
//     return NextResponse.json({
//       message: "ログインされていません。",
//       status: 401,
//     });
//   }
//   // 取得したtokenから必要な情報を変数へ代入
//   const userId = token.id;
//   const userPermissions = token.permission_ids; // userの権限の配列
//   const targetPermission = 1; // テンプレート作成に必要な権限ID

//   // userに権限があるかを確認
//   if (!userPermissions.includes(targetPermission)) {
//     // 権限が無い場合エラーを返す
//     console.error(`status:403 ${userId}はユーザー一覧の閲覧権限がありません`);
//     return NextResponse.json({
//       message: "ユーザー一覧の閲覧権限がありません",
//       status: 403,
//     });
//   }
//   try {
//     const { id: targetUserId } = UserIdParamSchema.parse(id);

//     if (targetUserId === parseInt(userId, 10)) {
//       return NextResponse.json(
//         { message: "自分自身のアカウントは無効化できません。" },
//         { status: 400 }
//       );
//     }

//     await db.users.update({
//       where: {
//         id: targetUserId,
//       },
//       data:{

//       }
//     })

//   } catch (error) {}
// }
