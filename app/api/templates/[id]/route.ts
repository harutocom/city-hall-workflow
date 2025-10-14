// app/api/templates/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { TemplateIdParamSchema } from "@/schemas/template";
import { getToken } from "next-auth/jwt";
import { TemplateSchema } from "@/schemas/template";

// 個々のテンプレ詳細を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 取得したparamsをzodスキーマを使い検証し、変換する
    const { id: templateId } = TemplateIdParamSchema.parse(params);

    // テンプレートとその詳細をapplication_templatesとtemplate_elementsから取得
    const template = await db.application_templates.findUnique({
      where: {
        id: templateId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        created_by: true,
        created_at: true,
        updated_at: true,
        template_elements: {
          select: {
            id: true,
            component_name: true,
            sort_order: true,
            props: true,
            data_type: true,
          },
          orderBy: {
            sort_order: "asc",
          },
        },
      },
    });

    // テンプレートのデータが無かった場合
    if (!template) {
      return NextResponse.json(
        { message: "指定されたテンプレートは見つかりませんでした。" },
        { status: 404 }
      );
    }

    // 取得結果を返す
    return NextResponse.json({ template });
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
        { status: 400 }
      );
    }
    // エラーが起きたらログを表示
    console.error(error);

    return NextResponse.json(
      { message: "テンプレートの詳細データの取得に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // テンプレートIDをパラメーターから取得
    const { id: templateId } = TemplateIdParamSchema.parse(params);

    // tokenを取得
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // tokenがあるか(ログイン中かどうか)を確認
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

    // フロントに入力されたデータを取得
    const data = await request.json();

    // zodスキーマでデータをバリデーションし型を変換する。
    const validatedData = TemplateSchema.parse(data);

    // データを分割代入
    const { name, description, elements } = validatedData;

    // DBに矛盾が生じないようにトランザクション処理を開始
    await db.$transaction(async (tx) => {
      // 親テーブルのapplication_templatesを部分更新
      const updatedTmeplates = await tx.application_templates.update({
        where: { id: templateId },
        data: {
          name: name,
          description: description,
        },
      });

      // 子テーブルのtemplate_elementsのデータを一括削除
      await tx.template_elements.deleteMany({
        where: { template_id: templateId },
      });

      // テンプレに必要な複数のフロントからのデータを配列として持っておく
      const elementsToCreate = elements.map((element) => ({
        template_id: updatedTmeplates.id,
        component_name: element.component_name,
        sort_order: element.sort_order,
        props: element.props,
        data_type: element.data_type,
      }));

      // 新しく子テーブルにデータを作成
      await tx.template_elements.createMany({
        data: elementsToCreate,
      });

      return updatedTmeplates;
    });

    return NextResponse.json(
      { message: "テンプレートを正常に編集しました。" },
      { status: 200 }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // テンプレートIDをパラメーターから取得
    const { id: templateId } = TemplateIdParamSchema.parse(params);

    // tokenを取得
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // tokenがあるか(ログイン中かどうか)を確認
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

    await db.$transaction(async (tx) => {
      // templateIdのデータをtemplate_elementsテーブルから削除
      await tx.template_elements.deleteMany({
        where: { template_id: templateId },
      });

      // templateIdのデータをapplication_templatesテーブルから削除
      await tx.application_templates.delete({
        where: { id: templateId },
      });

      // 削除なので何も返さない
      return;
    });

    // 返すものが無いのでメッセージと204 No Contentを返す
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("テンプレート削除中のエラー", error);
    return NextResponse.json(
      { message: "テンプレート削除中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
