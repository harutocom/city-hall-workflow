// schema/user.ts
// ユーザー用型検証のzodスキーマ
import { email, z } from "zod";

// パスワードの制約
const passwordRule = z
  .string()
  .min(8, "8文字以上で入力してください")
  .regex(/[A-Z]/, "英大文字を1文字以上含めてください")
  .regex(/[a-z]/, "英小文字を1文字以上含めてください")
  .regex(/[0-9]/, "数字を1文字以上含めてください")
  .regex(/[^a-zA-Z0-9]/, "記号を1文字以上含めてください");

// パスワード変更専用のスキーマ
export const UserPasswordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "現在のパスワードを入力してください。" }),
    newPassword: passwordRule, // passwordRuleを使い共通化
    confirmPassword: z
      .string()
      .min(1, { message: "確認用パスワードを入力してください。" }),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "新しいパスワードは現在のパスワードと異なるものを設定してください",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "新しいパスワードが一致しません",
    path: ["confirmPassword"],
  });

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
  password: passwordRule,
  departmentId: z.coerce
    .number()
    .int()
    .positive({ message: "部署IDは必須です。" }),
  roleId: z.coerce.number().int().positive({ message: "役職IDは必須です。" }),
  permissionId: z.coerce
    .number()
    .int()
    .min(1, { message: "権限は少なくとも1つ必要です。" }),
});

export const UserUpdateSchema = UserCreateSchema.omit({
  password: true, // パスワードは更新対象にしない
}).partial(); // 残りの項目（名前・部署など）を任意にする

// 型としてもexport
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserPasswordChange = z.infer<typeof UserPasswordChangeSchema>;
// export const UserUpdateSchema = z.object({
//   name: z.string().min(1).optional(),
//   email: z.string().email().optional(),
//   password: z
//     .string()
//     .min(8, { message: "パスワードは8文字以上で設定してください。" }).optional,
//   department_id: z.number().int().positive().optional(),
//   role_id: z.number().int().positive().optional(),
//   permission_id: z.number().int().min(1).optional(),
// });
