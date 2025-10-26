// schema/user.ts
// ユーザー用型検証のzodスキーマ
import { email, z } from "zod";

export const UserIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ユーザーIDは数値である必要があります。")
    .transform((val) => parseInt(val, 10)),
});

export const UserCreateSchema = z.object({
  name: z.string().min(1, { message: "氏名は必須です。" }),
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください。" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で設定してください。" }),
  department_id: z.number().int().positive({ message: "部署IDは必須です。" }),
  role_id: z.number().int().positive({ message: "役職IDは必須です。" }),
  permission_id: z
    .number()
    .int()
    .min(1, { message: "権限は少なくとも1つ必要です。" }),
});

export const UserUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  department_id: z.number().int().positive().optional(),
  role_id: z.number().int().positive().optional(),
  permission_ids: z.number().int().min(1).optional(),
});
