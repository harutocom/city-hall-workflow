// app/api/applications/[id]
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";
import { ApplicationCreateSchema } from "@/schemas/application";

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

export async function PUT(
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
    const applicantId = parseInt(token.id);
    const data = await request.json();
    const validatedData = ApplicationCreateSchema.parse(data);
    const { template_id, status, values } = validatedData;

    // 1. 既存データの取得とチェック
    const application = await db.applications.findUnique({
      where: { id: applicationId, deleted_at: null },
    });
    if (!application)
      return NextResponse.json(
        { message: "申請が見つかりません" },
        { status: 404 }
      );
    if (application.applicant_id !== parseInt(token.id as string)) {
      return NextResponse.json(
        { message: "あなたの申請書ではありません" },
        { status: 403 }
      );
    }
    if (application.status !== "draft" && application.status !== "remanded") {
      return NextResponse.json(
        { message: "現在のステータスでは編集できません" },
        { status: 400 }
      );
    }

    // 3. 更新処理
    const result = await db.$transaction(
      async (tx) => {
        // 親テーブルを更新
        const newApplication = await tx.applications.update({
          where: { id: applicationId },
          data: {
            applicant_id: applicantId,
            template_id: template_id,
            status: status,
            updated_at: new Date(),
            ...(status === "pending"
              ? { current_step: 1, submitted_at: new Date() }
              : {}),
          },
        });

        // データの型によって整理
        const newApplicationValues = values.map((item) => {
          let valText: string | null = null;
          let valNumber: number | null = null;
          let valDate: Date | null = null;
          let valBool: boolean | null = null;

          const v = item.value;

          if (typeof v === "number") {
            // 数値の場合
            valNumber = v;
          } else if (typeof v === "boolean") {
            // 真偽値の場合
            valBool = v;
          } else if (typeof v === "string") {
            // 文字列の場合、日付形式かどうかチェック
            const d = new Date(v);

            // 2025-11-22みたいな最初が数字4つ-数字2つ-数字2つの形式を日付とする
            const looksLikeDate = /^\d{4}-\d{2}-\d{2}/.test(v);

            if (!isNaN(d.getTime()) && looksLikeDate) {
              valDate = d;
            } else {
              // それ以外はただのテキスト
              valText = v;
            }
          }

          return {
            application_id: newApplication.id,
            sort_order: item.sort_order, // フロントから送られてきた順序を使用
            value_text: valText,
            value_number: valNumber,
            value_datetime: valDate,
            value_boolean: valBool,
          };
        });

        // 申請詳細を更新
        if (newApplicationValues.length > 0) {
          await tx.application_values.deleteMany({
            where: { application_id: applicationId },
          });
          await tx.application_values.createMany({
            data: newApplicationValues,
          });
        }

        if (status === "pending") {
          // 1. 古いステップがあれば削除 (下書きなら0件、差し戻しなら数件あるはず)
          await tx.application_approval_steps.deleteMany({
            where: { application_id: applicationId },
          });

          // 2. テンプレートからルート定義を取得 (POSTと同じロジック)
          const definedRoutes = await tx.template_approval_routes.findMany({
            where: { template_id: template_id },
            orderBy: { step_order: "asc" },
          });

          // 3. ステップを新規作成 (全員 PENDING でリセット)
          if (definedRoutes.length > 0) {
            const stepsData = definedRoutes.map((route) => ({
              application_id: applicationId,
              step_order: route.step_order,
              approver_id: route.approver_user_id!,
              status: "PENDING",
            }));

            await tx.application_approval_steps.createMany({
              data: stepsData,
            });
          }
        }
      },
      {
        // タイムアウトしないように待ち時間を編集
        maxWait: 5000, // 開始待ち: 5秒
        timeout: 10000, // 実行時間: 10秒
      }
    );

    return NextResponse.json(
      { message: "申請書を正常に編集できました" },
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
    console.error("申請書編集中のエラー", error);
    return NextResponse.json(
      { message: "申請書編集中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}

/**
 * 選択した申請をステータスによって削除するAPI
 * draft→物理削除
 * pending→論理削除
 * @param request
 * @param param1
 * @returns
 */
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
