// app/api/applications/[id]
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";

/**
 * 選択した申請の詳細を取得するAPI
 * * @auth 必須
 * @method GET
 * @param request NextRequest
 * @param param1 context.params.id 申請ID
 * @returns {Promise<NextResponse>} 申請詳細データのJSON
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. トークン取得し認証
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const parsedToken = z
      .object({ id: z.coerce.number().int() })
      .safeParse(token);
    if (!parsedToken.success)
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    const userId = parsedToken.data.id;

    // 2. パラメータから申請ID取得
    const { id } = await params;
    const applicationId = parseInt(id);
    if (isNaN(applicationId))
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    // 3. 申請詳細の取得
    const application = await db.applications.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        // 申請者の情報 (表示用に取得)
        users: {
          select: { name: true, department_id: true },
        },
        // テンプレートの詳細を取得
        application_templates: {
          include: {
            template_elements: {
              orderBy: { sort_order: "asc" },
            },
          },
        },
        // 入力された値
        application_values: {
          orderBy: { sort_order: "asc" },
        },
      },
    });

    // 4. 権限チェック(申請者本人の申請かチェック)
    if (!application || application.applicant_id !== userId) {
      return NextResponse.json(
        { message: "データが見つからないか、権限がありません。" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Application Detail Error:", error);
    return NextResponse.json(
      { message: "詳細の取得に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const applicationId = parseInt(id);

    // 1. 申請データを取得
    const application = await db.applications.findUnique({
      where: { id: applicationId },
    });
    if (!application)
      return NextResponse.json(
        { message: "申請が見つかりません" },
        { status: 400 }
      );

    // 2. 本人確認
    if (application.applicant_id !== parseInt(token.id as string)) {
      return NextResponse.json(
        { message: "権限がありません" },
        { status: 403 }
      );
    }

    // 3. 削除処理

    // 3.1 下書き(draft)の場合→物理削除
    if (application.status == "draft") {
      await db.$transaction(async (tx) => {
        // 子データから消していく(外部キー制約回避のため)
        await db.application_values.deleteMany({
          where: { application_id: applicationId },
        });

        // 添付ファイルがあれば消す(添付機能は未実装12/27時点)
        await tx.application_attachments.deleteMany({
          where: { application_id: applicationId },
        });

        // 承認ステップ定義があれば消す
        await tx.application_approval_steps.deleteMany({
          where: { application_id: applicationId },
        });

        // 最後に親(申請自体)を消す
        await tx.applications.delete({
          where: { id: applicationId },
        });
      });
      return new NextResponse(null, { status: 204 });
    }

    // 3.2 申請済み(pending)の場合→論理削除
    if (application.status == "pending") {
      // deleted_atに現在時刻を入力する
      await db.applications.update({
        where: { id: applicationId },
        data: { deleted_at: new Date() },
      });
      return new NextResponse(null, { status: 204 });
    }

    // 3.3 それ以外の時→エラー処理
    return NextResponse.json(
      { message: "既に処理が進んでいるため、この申請は削除できません。" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete Application Error:", error);
    return NextResponse.json(
      { message: "削除処理中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
