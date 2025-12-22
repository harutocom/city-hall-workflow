// app/api/applications
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";
import { ApplicationCreateSchema } from "@/schemas/application";
import { Prisma } from "@prisma/client";

/**
 * ユーザーが申請した申請一覧を取得するAPI
 * * @auth 必須
 * @method GET
 * @param request クエリパラメータ: ?draft or ?pending
 * @returns {Promise<NextResponse>} 申請データのJSON配列
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

    const parsedToken = z
      .object({ id: z.coerce.number().int() })
      .safeParse(token);
    if (!parsedToken.success) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }
    const userId = parsedToken.data.id;

    // 2. クエリパラメータの取得し表示する内容を決める
    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get("status"); // "draft" や "pending" が入る

    // 3. statusによって取得内容を変える準備
    // 変数を作成
    const whereCondition: Prisma.applicationsWhereInput = {
      applicant_id: userId,
    };
    // statusを入れる
    if (statusParam) {
      whereCondition.status = statusParam;
    }

    // 4. 自分の申請一覧を取得
    const myApplications = await db.applications.findMany({
      where: whereCondition, // statusによって動的な条件を適用
      include: {
        application_templates: {
          select: { name: true }, // 別のテーブルからテンプレート名も取得
        },
        approval_flows: {
          // 別のapproval_flowsからもデータを取得
          select: {
            approver_id: true, // 承認者ID
            action: true, // 承認者がこの申請に行ったアクション(pending or rejected or approved)
            users: { select: { name: true } }, // 承認者名
          },
          orderBy: { id: "asc" }, // 承認順
        },
      },
      orderBy: {
        created_at: "desc", // 新しい順
      },
    });

    // 5. 結果を返す
    return NextResponse.json(myApplications);
  } catch (error) {
    // エラー処理
    console.error("My Applications Error:", error);
    return NextResponse.json(
      { message: "申請履歴の取得に失敗しました。" },
      { status: 500 }
    );
  }
}

/**
 * 申請を作成するAPI
 * * @auth 必須
 * @method POST
 * @param request
 * @returns {Promise<NextResponse>} 作成した申請データの詳細情報のjson
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 認証
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // トークンが無かったらエラーを返す
      return NextResponse.json({
        message: "ログインされていません。",
        status: 401,
      });
    }

    // token.id を直接検証・使用する
    // tokenの型が不明なため、zodで安全にパースする
    const parsedToken = z
      .object({
        id: z.coerce
          .number()
          .int({ message: "IDは整数である必要があります。" }),
      })
      .safeParse(token);

    if (!parsedToken.success) {
      return NextResponse.json(
        { message: "トークン情報が不正です。" },
        { status: 400 }
      );
    }

    // 2. フロントからのデータを取得
    const data = await request.json();
    const validatedData = ApplicationCreateSchema.parse(data);
    const { template_id, status, values, approvers } = validatedData;
    const applicant_id = parsedToken.data.id; // 申請者をtokenから取得

    // 3. 申請データ作成
    // トランザクション処理開始
    const result = await db.$transaction(
      async (tx) => {
        // フロントからのデータを親テーブル(applications)に保存
        const newApplication = await tx.applications.create({
          data: {
            applicant_id: applicant_id,
            template_id: template_id,
            status: status,
          },
        });

        // フロントからのデータを型によって整理
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

        // 申請詳細を保存
        if (newApplicationValues.length > 0) {
          await tx.application_values.createMany({
            data: newApplicationValues,
          });
        }

        // 申請された場合のみ承認フローを保存
        if (status === "pending" && approvers.length > 0) {
          const flowData = approvers.map((approver) => ({
            application_id: newApplication.id,
            approver_id: approver.approver_id,
            action: "pending", // 未承認なので "pending"
            comment: null,
          }));

          // 承認フローを作成
          await tx.approval_flows.createMany({
            data: flowData,
          });
        }
        return newApplication;
      },
      {
        // タイムアウトしないように待ち時間を編集
        maxWait: 5000, // 開始待ち: 5秒
        timeout: 10000, // 実行時間: 10秒
      }
    );

    // 成功時のレスポンス
    return NextResponse.json(result, { status: 201 });
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
    console.error("申請書作成中のエラー", error);
    return NextResponse.json(
      { message: "申請書作成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
