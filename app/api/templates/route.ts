// app/api/templates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";
import { TemplateCreateSchema } from "@/schemas/template";

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
    // フロントからデータを取得
    const data = await request.json();
    // フロントのデータが正しいかzodを使い検証し、型を変換する
    const validatedData = TemplateCreateSchema.parse(data);
    // validatedDataから各値を分割代入で取り出す
    const { name, description, elements } = validatedData;
    // テンプレ作成者のIDもtokenから取得
    const createdById = token.id;

    // DBに矛盾が生じないようにトランザクション処理を開始
    await db.$transaction(async (tx) => {
      // 親テーブルのapplication_templatesにデータを作成
      const newTemplates = await tx.application_templates.create({
        data: {
          name: name,
          description: description,
          created_by: parseInt(createdById, 10),
        },
      });

      // テンプレに必要な複数のフロントからのデータを配列として持っておく
      const elementsToCreate = elements.map((element) => ({
        template_id: newTemplates.id, // 👈 親IDを設定
        component_name: element.component_name,
        sort_order: element.sort_order,
        props: element.props,
        data_type: element.data_type,
      }));

      // createManyを追加配列のデータを一括で作成(効率が良くなる)
      await tx.template_elements.createMany({
        data: elementsToCreate,
      });

      return newTemplates;
    });

    // テンプレート追加処理成功時のレスポンス
    return NextResponse.json(
      { message: "テンプレートを正常に作成しました。" },
      { status: 201 }
    );
  } catch (error) {
    // エラーがzodによるものかそれ以外かを判断
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
    // zod以外のエラーの場合は普通にerrorを返す
    console.error("テンプレート作成中のエラー", error);
    return NextResponse.json(
      { message: "テンプレート作成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
