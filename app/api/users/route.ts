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

  if (!token) {
    return NextResponse.json(
      { message: "ログインされていません。" },
      { status: 401 },
    );
  }

  // 取得したtokenから必要な情報を変数へ代入
  const userId = token.id;
  const userPermissions = token.permission_ids; // userの権限の配列
  // const targetPermission = 1; // テンプレート作成に必要な権限ID

  // // userに権限があるかを確認
  // if (!userPermissions.includes(targetPermission)) {
  //   // 権限が無い場合エラーを返す
  //   console.error(`status:403 ${userId}はユーザー一覧の閲覧権限がありません`);
  //   return NextResponse.json({
  //     message: "ユーザー一覧の閲覧権限がありません",
  //     status: 403,
  //   });
  // }

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
        granted_leave_hours: true,
        remaining_leave_hours: true,
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
