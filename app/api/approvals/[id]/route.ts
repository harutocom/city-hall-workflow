// app/api/approvals/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // トークン情報の検証
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const parsedToken = z
      .object({ id: z.coerce.number().int() })
      .safeParse(token);
    if (!parsedToken.success) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }
    const userId = parsedToken.data.id;

    // パラメータからid(approval_flowsのid)を取得
    const { id } = await params;
    const approvalFlowId = parseInt(id);
    // idが無かった場合のエラー処理
    if (isNaN(approvalFlowId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // ID指定で1件取得 (自分が承認者のものに限る)
    const approval = await db.approval_flows.findUnique({
      where: {
        id: approvalFlowId,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // トークン情報の検証
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

    // IDとリクエストボディの取得
    const { id } = await params;
    const approvalFlowId = parseInt(id);
    if (isNaN(approvalFlowId))
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    const body = await request.json();

    // バリデーション: actionは "approve" か "remand" のみ許可
    const { action, comment } = z
      .object({
        action: z.enum(["approve", "remand"]),
        comment: z.string().optional(),
      })
      .parse(body);

    // トランザクション処理開始
    const result = await db.$transaction(async (tx) => {
      // まず対象の承認タスクを取得
      const currentFlow = await tx.approval_flows.findUnique({
        where: { id: approvalFlowId },
      });

      // 権限チェック & ステータスチェック
      if (!currentFlow || currentFlow.approver_id !== userId) {
        throw new Error("FORBIDDEN"); // 自分のじゃない
      }
      if (currentFlow.action !== "pending") {
        throw new Error("ALREADY_PROCESSED"); // 既に承認/差戻し済み
      }

      // 承認フローのステータス更新
      const updatedFlow = await tx.approval_flows.update({
        where: { id: approvalFlowId },
        data: {
          action: action, // "approve" or "remand"
          comment: comment,
          acted_at: new Date(),
        },
      });

      // 申請本体 (Applications) のステータス更新
      let newAppStatus = "";
      if (action === "remand") {
        newAppStatus = "draft"; // 差し戻し -> 下書きに戻す(再編集可能に)
      } else {
        newAppStatus = "approved"; // 承認 -> 承認済みにする
      }

      await tx.applications.update({
        where: { id: currentFlow.application_id },
        data: {
          status: newAppStatus,
          // 承認なら完了日時を入れる
          completed_at: action === "approve" ? new Date() : null,
        },
      });

      return updatedFlow;
    });

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
