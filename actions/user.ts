// /actions/user.ts
"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { UserPasswordChangeSchema } from "@/schemas/user"; // 先ほど作成したスキーマ

// 戻り値の型定義
export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>; // Zodのエラーメッセージ格納用
};

export async function changePassword(data: unknown): Promise<ActionResponse> {
  try {
    // 1. 認証チェック
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return {
        success: false,
        message: "認証セッションが切れました。再度ログインしてください。",
      };
    }

    // 2. Zodによるバリデーション
    const result = UserPasswordChangeSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return {
        success: false,
        message: "入力内容に不備があります。",
        errors: fieldErrors,
      };
    }

    const { currentPassword, newPassword } = result.data;

    // 3. DBから最新のユーザー情報を取得
    const user = await db.users.findUnique({
      // session.user.id を数値に変換して検索（DBが数値型の場合）
      where: { id: Number(session.user.id) },
    });

    if (!user || !user.password_hash) {
      return { success: false, message: "ユーザー情報が見つかりません。" };
    }

    // 4. 現在のパスワードが正しいかチェック
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return {
        success: false,
        message: "現在のパスワードが正しくありません。",
        // 特定のフィールドにエラーを紐付けたい場合は errors に入れる
        errors: { currentPassword: ["パスワードが一致しません。"] },
      };
    }

    // 5. 新しいパスワードをハッシュ化して更新
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.users.update({
      // 取得した user.id を使うのが一番確実です
      where: { id: user.id },
      data: { password_hash: hashedNewPassword },
    });

    return { success: true, message: "パスワードを正常に変更しました。" };
  } catch (error) {
    console.error("Password Change Error:", error);
    return {
      success: false,
      message: "予期せぬエラーが発生しました。管理者にお問い合わせください。",
    };
  }
}
