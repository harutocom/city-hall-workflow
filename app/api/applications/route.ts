// app/api/applications
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { z } from "zod";
import { ApplicationCreateSchema } from "@/schemas/application";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // tokenが無かったらエラーを返す
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

    // フロントからのデータを取得
    const data = await request.json();
    const validatedData = ApplicationCreateSchema.parse(data);
    const { template_id, status, values, approvers } = validatedData;
    const applicant_id = parsedToken.data.id; // 申請者をtokenから取得

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

        // 申請内容を保存
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
            action: "pending", // まだ承認されていないので "pending" とする
            comment: null,
          }));

          await tx.approval_flows.createMany({
            data: flowData,
          });
        }
        return newApplication;
      },
      {
        maxWait: 5000, // 開始待ち: 2秒 -> 5秒に延長
        timeout: 10000, // 実行時間: 5秒 -> 10秒に延長
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
