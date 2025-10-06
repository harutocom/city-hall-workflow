// app/api/templates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

// templatesテーブルから一覧を取得する
export async function GET() {
  try {
    // 必要な情報を取得
    const templates = await db.application_templates.findMany({
      select: {
        id: true,
        name: true,
        created_by: true,
        updated_at: true,
        description: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      //   取得した情報の順番はupdated_atの降順(新しい順)
      orderBy: {
        updated_at: "desc",
      },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    // エラーが起きたらログを表示
    console.error(error);

    return NextResponse.json(
      { message: "テンプレートデータの取得に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    //userに権限があるかを確認
    if (!userPermissions.includes(targetPermission)) {
      // 権限が無い場合エラーを返す
      console.error(`status:403 ${userId}はテンプレート作成の権限がありません`);
      return NextResponse.json({
        message: "テンプレート作成の権限がありません",
        status: 403,
      });
    }

    const data = await request.json();
    const a = data;

    return;
  } catch (error) {
    console.error(error);
    return;
  }
}
