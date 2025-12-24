// app/api/approvals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";

/**
 * 承認する申請の詳細を取得するAPI
 *  * @auth 必須 自分が承認者
 * @method GET
 * @param request NextRequest
 * @param param1 context.params.id 選択された申請ID
 * @returns {Promise<NextResponse>} 承認する申請詳細データのJSON
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. トークンを取得し認証
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. パラメータからIDを取得
    // トークンをバリデーション
    const parsedToken = z
      .object({ id: z.coerce.number().int() })
      .safeParse(token);
    if (!parsedToken.success) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }
    // userID
    const userId = parsedToken.data.id;

    // 申請ID
    const { id } = await params;
    const stepId = parseInt(id);
    // idが無かった場合のエラー処理
    if (isNaN(stepId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // 3. 申請詳細を取得
    const approval = await db.application_approval_steps.findUnique({
      where: {
        id: stepId,
      },
      include: {
        applications: {
          include: {
            users: {
              // 申請者情報
              select: { name: true, department_id: true },
            },
            application_templates: {
              include: {
                template_elements: {
                  orderBy: { sort_order: "asc" },
                },
              },
            },
            // 申請された値も一緒に取ってくる
            application_values: {
              orderBy: { sort_order: "asc" },
            },
          },
        },
      },
    });

    // データがない、または自分宛てじゃない場合
    if (!approval || approval.approver_id !== userId) {
      return NextResponse.json(
        { message: "承認データが見つからないか、権限がありません。" },
        { status: 404 }
      );
    }

    return NextResponse.json(approval);
  } catch (error) {
    console.error("Approval Detail Error:", error);
    return NextResponse.json(
      { message: "承認詳細の取得に失敗しました。" },
      { status: 500 }
    );
  }
}

/**
 * 申請のステータスを変更するAPI(承認 or 差し戻し)
 * * @auth 必須 自分が承認者
 * @method PATCH
 * @param request NextRequest
 * @param param1 context.params.id 選択された申請ID
 * @returns {Promise<NextResponse>} 承認 or 差し戻し後の申請詳細データのJSON
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. トークンを取得し認証
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

    // 2. トークンからIDの取得
    const userId = parsedToken.data.id; // userID
    const { id } = await params; // 選択された申請ID
    const stepId = parseInt(id);
    if (isNaN(stepId))
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    // 3. フロントから送られてきたデータを取得し検証
    const body = await request.json();

    // バリデーション: actionは "approve" か "remand" のみ許可
    const { action, comment } = z
      .object({
        action: z.enum(["approve", "remand"]),
        comment: z.string().optional(),
      })
      .parse(body);

    // 4. actionに応じて処理
    // トランザクション処理開始
    const result = await db.$transaction(
      async (tx) => {
        // 4.1 申請内容を取得

        // まず対象の承認タスクを取得
        const currentStep = await tx.application_approval_steps.findUnique({
          where: { id: stepId },
          include: {
            applications: {
              include: {
                // 減算ロジック用にテンプレートと値を取得しておく
                application_templates: true,
                application_values: true,
              },
            },
          },
        });

        // 権限チェック & ステータスチェック
        if (!currentStep || currentStep.approver_id !== userId) {
          throw new Error("FORBIDDEN"); // 自分のじゃない
        }
        if (currentStep.status !== "PENDING") {
          throw new Error("ALREADY_PROCESSED"); // 既に承認/差戻し済み
        }

        // 申請本体 (Applications) のステータス更新
        let newAppStatus = "";
        if (action === "remand") {
          newAppStatus = "draft"; // 差し戻し：下書きに戻す(再編集可能に)
        } else {
          newAppStatus = "approved"; // 承認：承認済みにする
        }

        // 4.2 現在のステップを更新(申請本体ではなく承認ルートのステータス)
        const updatedStep = await tx.application_approval_steps.update({
          where: { id: stepId },
          data: {
            status: action === "approve" ? "APPROVED" : "REMANDED",
            comment: comment,
            acted_at: new Date(),
          },
        });

        // 4.3 差し戻しの場合ステップをリセットして処理を終了
        if (action === "remand") {
          // ★変更: 申請全体を下書きに戻し、ステップを1(最初)にリセット
          await tx.applications.update({
            where: { id: currentStep.application_id },
            data: {
              status: "draft",
              current_step: 1,
            },
          });
          // 差し戻しの場合はここで終了
          return updatedStep;
        }

        // 4.4 次の承認者を探す
        const nextStep = await tx.application_approval_steps.findFirst({
          where: {
            application_id: currentStep.application_id,
            step_order: currentStep.step_order + 1,
          },
        });

        // 4.5.1 次の承認者がいる場合、申請本体のステップを進めて終了
        if (nextStep) {
          // ★変更: アプリ本体の current_step を進めるだけ (完了にはしない)
          await tx.applications.update({
            where: { id: currentStep.application_id },
            data: { current_step: nextStep.step_order },
          });

          // ここで終了（有給減算はまだしない！）
          return updatedStep;
        }

        // 4.5.2 次の承認者が居ない場合、申請本体のステータスを更新する
        await tx.applications.update({
          where: { id: currentStep.application_id },
          data: {
            status: newAppStatus,
            // 承認なら完了日時を入れる
            completed_at: action === "approve" ? new Date() : null,
          },
        });

        // 4.6 休暇願の承認時は期間から時間を計算し自動減産する
        // 判断材料（テンプレート名・入力値）を取得
        const appData = await tx.applications.findUnique({
          where: { id: currentStep.application_id },
          include: {
            application_templates: true,
            application_values: true,
          },
        });

        // 条件: 「承認」かつ「テンプレート名に'休暇'が含まれる」
        if (
          action === "approve" &&
          appData?.application_templates.name.includes("休暇")
        ) {
          // 期間入力(DateRange)の値を探す ("~" が含まれていれば期間とみなす)
          const rangeValue = appData.application_values.find(
            (v) => v.value_text && v.value_text.includes("~")
          );

          if (rangeValue && rangeValue.value_text) {
            // 文字列 "2025-01-01~2025-01-03"(例) を分割
            const [startStr, endStr] = rangeValue.value_text.split("~");

            if (startStr && endStr) {
              const startDate = new Date(startStr);
              const endDate = new Date(endStr);

              // 日数計算: (差分ミリ秒 / 1日のミリ秒) + 1日(当日分)
              const diffTime = Math.abs(
                endDate.getTime() - startDate.getTime()
              );
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

              // 時間計算: 日数 × 7.75時間 (一旦定時で計算)
              const hoursPerDay = 7.75;
              const hoursToDeduct = diffDays * hoursPerDay;

              // 4. 減算実行
              await tx.users.update({
                where: { id: appData.applicant_id },
                data: {
                  remaining_leave_hours: { decrement: hoursToDeduct },
                },
              });
            }
          }
        }

        return updatedStep;
      },
      {
        // タイムアウトしないように待ち時間を編集
        maxWait: 5000, // トランザクション開始待ち (5秒)
        timeout: 10000, // 実行時間リミット (10秒に延長)
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Approval Action Error:", error);

    // エラーの種類に応じたレスポンス
    if (error instanceof Error) {
      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          { message: "権限がありません。" },
          { status: 403 }
        );
      }
      if (error.message === "ALREADY_PROCESSED") {
        return NextResponse.json(
          { message: "既に処理済みの申請です。" },
          { status: 409 }
        );
      }
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "入力値が不正です。" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "承認処理に失敗しました。" },
      { status: 500 }
    );
  }
}
