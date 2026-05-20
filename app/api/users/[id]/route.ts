// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserIdParamSchema, UserUpdateSchema } from "@/schemas/user";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const userPermissions = token.permission_ids;
  const targetPermission = 1;

  if (!userPermissions.includes(targetPermission)) {
    return NextResponse.json(
      { message: "ユーザー一覧の閲覧権限がありません" },
      { status: 403 },
    );
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
        { status: 404 },
      );
    }

    // 取得結果を返す
    return NextResponse.json({ user });
  } catch (error) {
    // 起こったエラーがzodのものかどうか
    if (error instanceof z.ZodError) {
      // zodエラーの場合どこの入力でエラーかを返す
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
    // エラーが起きたらログを表示
    console.error(error);

    return NextResponse.json(
      { message: "ユーザーの詳細データ取得に失敗しました。" },
      { status: 500 },
    );
  }
}

/**
 * ユーザー情報を更新するAPI
 * @param request
 * @param param1
 * @returns ユーザー情報(パスワード以外)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const userPermissions = token.permission_ids;
  const targetPermission = 1;

  if (!userPermissions.includes(targetPermission)) {
    return NextResponse.json(
      { message: "ユーザー編集の権限がありません" },
      { status: 403 },
    );
  }

  try {
    // パラメータからidを取得
    const { id } = await params;

    // 取得したidをzodスキーマを使い型検証と変換
    const { id: userId } = UserIdParamSchema.parse({ id });

    // フロントからデータ取得
    const body = await request.json();

    // フロントからのデータをバリデーションと型変換
    const validatedBody = UserUpdateSchema.parse(body);

    // フロントからのデータを分割代入と型を合わせる(ifを使うとvscodeの型推論が利かなくなるから)
    const { permissionIds, departmentId, roleId, ...userData } = validatedBody;
    // Prismaに渡すオブジェクトを組み立てる
    const dataToUpdate: Prisma.usersUpdateInput = {
      ...userData,
      // 数字を直接入れるのではなく、connect（紐付け）という命令を送る
      departments: departmentId ? { connect: { id: departmentId } } : undefined,
      roles: roleId ? { connect: { id: roleId } } : undefined,
    };
    // トランザクション処理開始
    const user = await db.$transaction(async (tx) => {
      // idがuserIdのデータだけ更新
      const updateUser = await tx.users.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      // 権限の更新があれば置き換え
      if (permissionIds) {
        await tx.user_permissions.deleteMany({
          where: { user_id: userId },
        });

        if (permissionIds.length > 0) {
          await tx.user_permissions.createMany({
            data: permissionIds.map((id: number) => ({
              user_id: userId,
              permission_id: id,
            })),
          });
        }
      }
      return updateUser;
    });

    // 編集後のuser情報を返す(パスワード以外)
    const { password_hash, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // zodエラーの場合どこの入力でエラーかを返す
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
    console.error("ユーザー編集中のエラー", error);
    console.error("[REGISTRATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

  const userId = token.id;
  const userPermissions = token.permission_ids;
  const targetPermission = 1;

  if (!userPermissions.includes(targetPermission)) {
    return NextResponse.json(
      { message: "ユーザー削除権限がありません" },
      { status: 403 },
    );
  }
  try {
    const { id: targetUserId } = UserIdParamSchema.parse({ id });

    // 自分自身のアカウントを無効化できないように
    if (targetUserId === parseInt(userId, 10)) {
      return NextResponse.json(
        { message: "自分自身のアカウントは無効化できません。" },
        { status: 400 },
      );
    }

    const targetUser = await db.users.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { message: "対象のユーザーが見つかりません。" },
        { status: 404 },
      );
    }

    /**
     * usersテーブルにdeleted_atを追加
     * メールアドレスのユニーク制約を保ったまま論理削除後のメールアドレスを開放するために
     * 論理削除時にメールアドレスにdeleted_とタイムスタンプを追加することで別の文字列にして
     * ユニーク制約を維持しつつメールアドレスを開放し、さらに元データを追えるようにしてる。
     */
    await db.users.update({
      where: {
        id: targetUserId,
      },
      data: {
        deleted_at: new Date(),
        email: `deleted_${Date.now()}_${targetUser.email}`,
      },
    });

    // 結果を返す
    return NextResponse.json({ message: "ユーザーを無効化しました" });
  } catch (error) {
    // 起こったエラーがzodのものかどうか
    if (error instanceof z.ZodError) {
      // zodエラーの場合どこの入力でエラーかを返す
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
    // エラーが起きたらログを表示
    console.error(error);

    return NextResponse.json(
      { message: "ユーザーの無効化に失敗しました。" },
      { status: 500 },
    );
  }
}
