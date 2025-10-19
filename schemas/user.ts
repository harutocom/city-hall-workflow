// schema/user.ts
// ユーザー用型検証のzodスキーマ
import { z } from "zod";

export const UserIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ユーザーIDは数値である必要があります。")
    .transform((val) => parseInt(val, 10)),
});
