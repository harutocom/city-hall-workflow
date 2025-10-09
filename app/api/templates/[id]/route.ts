// app/api/templates/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { TemplateIdParamSchema } from "@/schemas/template";

// 個々のテンプレ詳細を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 取得したparamsをzodスキーマを使い検証
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
