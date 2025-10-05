// app/api/templates/route.ts
import { NextResponse } from "next/server";
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
