// /schema/template.ts
import { z } from "zod";

export const TemplateElementSchema = z.object({
  id: z.number().int().optional(),
  component_name: z.string().min(1),
  sort_order: z.number().int().min(0),
  props: z.record(z.string(), z.any()),
  data_type: z.string().optional(),
});

// ★追加: 承認ルートのスキーマ
const ApprovalRouteSchema = z.object({
  step_order: z.number().int().min(1),
  approver_user_id: z.number().int(), // 今回はUser直接指定
});

export const TemplateSchema = z.object({
  name: z.string().min(1, { message: "テンプレート名は必須です。" }),
  description: z.string().nullable().optional(),
  elements: z.array(TemplateElementSchema).min(1),
  approval_routes: z.array(ApprovalRouteSchema).optional(),
});

export const TemplateIdParamSchema = z.object({
  id: z
    .string()
    // 型は文字列だが中身が数字かを判断
    .regex(/^\d+$/, "テンプレートIDは数値である必要があります。")
    .transform((val) => parseInt(val, 10)),
});
