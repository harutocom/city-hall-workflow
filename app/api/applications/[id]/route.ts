// app/api/applications/[id]
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. トークン検証 (いつもの)
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

    // 2. ID取得
    const { id } = await params;
    const applicationId = parseInt(id);
    if (isNaN(applicationId))
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    // 3. 申請詳細の取得
    // ★ここが変更点: approval_flows ではなく applications テーブルを直接見る
    const application = await db.applications.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        // 申請者の情報 (自分だけど表示用に取得)
        users: {
          select: { name: true, department_id: true },
        },
        // テンプレートと項目定義
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

    // 4. 権限チェック
    // ★ここが変更点: 「申請者本人 (applicant_id)」かどうかをチェック
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
