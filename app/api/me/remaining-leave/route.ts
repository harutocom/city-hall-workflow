// app/api/me/remaining-leave

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(request: NextRequest) {
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
      { status: 401 }
    );
  }

  try {
    // token.id を直接検証・使用する
    // tokenの型が不明なため、zodで安全にパースする
    const parsedToken = z
      .object({
        id: z.coerce
          .number()
          .int({ message: "IDは整数である必要があります。" }),
      })
      .safeParse(token);

    if (!parsedToken.success) {
      return NextResponse.json(
        { message: "トークン情報が不正です。" },
        { status: 400 }
      );
    }

    // params由来ではなく、token由来のIDを使用
    const userId = parsedToken.data.id;

    //
    const user = await db.users.findUnique({
      where: { id: userId },
      select: {
        remaining_leave_hours: true,
      },
    });

    // 残余時間が取得できなかった場合エラーを返す
    if (!user) {
      return NextResponse.json(
        { message: "対象のユーザーが見つかりませんでした。" },
        { status: 404 }
      );
    }

    // 取得結果を返す
    return NextResponse.json(user);
  } catch (error) {
    // エラーが起きたらログを表示
    console.error(error);

    return NextResponse.json(
      { message: "ユーザーの残余時間の取得に失敗しました。" },
      { status: 500 }
    );
  }
}
