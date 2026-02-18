// /actions/user.ts
"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { UserPasswordChangeSchema } from "@/schemas/user";
import { UserCreateSchema } from "@/schemas/user";
import { revalidatePath } from "next/cache";

// 戻り値の型定義
export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
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
        errors: { currentPassword: ["パスワードが一致しません。"] },
      };
    }

    // 5. 新しいパスワードをハッシュ化して更新
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.users.update({
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

export async function createUser(data: unknown): Promise<ActionResponse> {
  try {
    // 1. バリデーション
    const result = UserCreateSchema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        message: "入力内容に不備があります。",
        errors: result.error.flatten().fieldErrors,
      };
    }

    const {
      name,
      email,
      password,
      departmentId,
      roleId,
      permissionId,
      remaining_leave_hours,
    } = result.data;

    // 2. 重複チェック
    const existingUser = await db.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      return {
        success: false,
        message: "このメールアドレスは既に使用されています。",
        errors: { email: ["既に使用されています"] },
      };
    }

    // 3. パスワードハッシュ化
    const passwordHash = await bcrypt.hash(password, 12); // APIに合わせて12に変更

    // 4. DB作成（ここをAPIのロジックに合わせました！）
    await db.users.create({
      data: {
        name,
        email,
        password_hash: passwordHash,
        remaining_leave_hours: remaining_leave_hours,
        departments: {
          connect: { id: departmentId },
        },
        roles: {
          connect: { id: roleId },
        },
        user_permissions: {
          create: {
            permissions: {
              connect: { id: permissionId },
            },
          },
        },
      },
    });

    revalidatePath("/settings/users");
    return { success: true, message: "ユーザーを作成しました" };
  } catch (error) {
    console.error("User Create Error:", error);
    return { success: false, message: "サーバーエラーが発生しました。" };
  }
}
