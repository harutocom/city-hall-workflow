// app/api/approvals
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";

/**
 * 承認する申請一覧を取得するAPI
 * userIDがログイン中のユーザーかつステータスがpendingのものを取得
 * @param request
 * @returns 取得した申請一覧
 */
export async function GET(request: NextRequest) {
  try {
    // トークンを取得
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    // トークンが無い場合エラー処理
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // IDの取り出しと検証
    const parsedToken = z
      .object({
        id: z.coerce.number().int(),
      })
      .safeParse(token);
    // IDが無かった場合のエラー処理
    if (!parsedToken.success) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }
    const userId = parsedToken.data.id;

    // 承認待ちリストの取得
    const pendingApprovals = await db.approval_flows.findMany({
      where: {
        approver_id: userId, // 自分宛て
        action: "pending", // 未処理
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
        acted_at: "desc", // 新しい順
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
