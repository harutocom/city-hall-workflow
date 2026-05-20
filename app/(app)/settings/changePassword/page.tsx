"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserPasswordChangeSchema,
  type UserPasswordChange,
} from "@/schemas/user";
import { changePassword } from "@/actions/user";

export default function PasswordChangeForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. useFormの設定
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserPasswordChange>({
    resolver: zodResolver(UserPasswordChangeSchema),
    mode: "onChange", // 入力するたびにバリデーション実行（リアルタイム！）
  });

  // 2. 送信時の処理
  const onSubmit = async (data: UserPasswordChange) => {
    setServerError(null);
    setSuccessMessage(null);

    const result = await changePassword(data);

    if (result.success) {
      setSuccessMessage("パスワードを変更しました！");
      reset(); // フォームをクリア
    } else {
      setServerError(result.message || "エラーが発生しました");
      // サーバー側で特定のフィールドエラーがあれば、ここでセットすることも可能
      // (今回はシンプルにメッセージ表示だけに留めています)
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">パスワード変更</h2>

      {/* 成功・エラーメッセージ表示エリア */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {serverError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 現在のパスワード */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            現在のパスワード
          </label>
          <input
            type="password"
            {...register("currentPassword")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* 新しいパスワード */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            新しいパスワード
          </label>
          <input
            type="password"
            {...register("newPassword")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            ※8文字以上、英大文字・小文字・数字・記号を含めてください
          </p>
        </div>

        {/* 確認用パスワード */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            新しいパスワード（確認）
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "変更中..." : "変更する"}
        </button>
      </form>
    </div>
  );
}
