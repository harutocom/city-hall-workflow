// schemas/application.ts

import { z } from "zod";

// values配列の中身（1項目分）のスキーマ
const ApplicationValueSchema = z.object({
  sort_order: z.number().int().positive(),

  // valueは「文字列、数値、真偽値」のいずれか
  // 日付もフロントからは文字列(ISO 8601)で送られてくる想定
  value: z.union([z.string(), z.number(), z.boolean()]),
});

// approvers配列の中身（1人分）のスキーマ
const ApproverSchema = z.object({
  approver_id: z.number().int().positive(),
  step_order: z.number().int().positive(),
});

// POST /api/applications のリクエストボディ全体のスキーマ
export const ApplicationCreateSchema = z.object({
  template_id: z.number().int().positive({
    message: "テンプレートIDは必須です。",
  }),

  // MVPでは "pending" のみだが、将来性のため "draft" も許可
  status: z.enum(["draft", "pending"], {
    message: "ステータスは 'draft' または 'pending' である必要があります。",
  }),

  // 1件以上の入力値が必要
  values: z.array(ApplicationValueSchema).min(1, {
    message: "申請内容（values）は必須です。",
  }),
});
// .refine(
//   (data) => {
//     // もし status が "pending" (送信) なら、
//     // 承認者(approvers)は1人以上必須
//     if (data.status === "pending") {
//       return data.approvers.length > 0;
//     }
//     // "draft" (一時保存) なら、承認者が0人でもOK
//     return true;
//   },
//   {
//     message:
//       "送信（pending）する場合、承認者（approvers）は1人以上必要です。",
//     // このエラーが "approvers" フィールドに関連することを指定
//     path: ["approvers"],
//   }
// );
