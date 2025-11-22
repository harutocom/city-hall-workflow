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
    // トークン情報の確認
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
              // テンプレート名
              select: { name: true },
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
