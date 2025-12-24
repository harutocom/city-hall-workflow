// app/api/approvals
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";

/**
 * 承認する申請一覧を取得するAPI(status="pending"のものだけ)
 * * @auth 必須 自分が承認者
 * @method GET
 * @param request NextRequest
 * @returns {Promise<NextResponse>} 承認待ち申請のJSON配列
 */
export async function GET(request: NextRequest) {
  try {
    // 1. トークンを取得し認証
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. トークンからuserIDを取得
    const parsedToken = z
      .object({
        id: z.coerce.number().int(),
      })
      .safeParse(token);
    if (!parsedToken.success) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }
    const userId = parsedToken.data.id;

    // 3. 承認待ちリストの取得
    const pendingApprovals = await db.application_approval_steps.findMany({
      where: {
        approver_id: userId, // 自分宛て
        status: "PENDING", // 未処理
      },
      // 一覧表示に必要な情報を結合して取ってくる
      include: {
        applications: {
          include: {
            users: {
              // 申請者の名前
              select: { name: true, department_id: true },
            },
            application_templates: {
              // テンプレート名
              select: { name: true },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc", // 新しい順
      },
    });

    return NextResponse.json(pendingApprovals);
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
    console.error("承認待ち一覧取得時のエラー", error);
    return NextResponse.json(
      { message: "承認待ち一覧取得中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
