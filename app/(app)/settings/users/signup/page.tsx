// app/(auth)/settings/users/signup/page.tsx

"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form"; // ★追加
import { zodResolver } from "@hookform/resolvers/zod"; // ★追加
import { UserCreateSchema, type UserCreate } from "@/schemas/user"; // ★追加
import { createUser } from "@/actions/user"; // ★追加

const departments = [
  { id: 1, name: "DX推進課" },
  { id: 2, name: "総務課" },
];

const roles = [
  { id: 1, name: "課長" },
  { id: 2, name: "係長" },
  { id: 3, name: "一般" },
];

export default function Signup() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  // ★ useFormの設定
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      permissionId: 2, // デフォルトでユーザー権限を選択状態にするなどの工夫
    },
  });

  // ★ サインアップ処理
  const onSubmit = async (data: UserCreate) => {
    setServerError(null);

    const result = await createUser(data);

    if (result.success) {
      toast.success("ユーザーが作成されました。");
      reset();
      router.push("/settings/users");
      router.refresh(); // 一覧画面のデータを最新にする
    } else {
      setServerError(result.message || "ユーザー作成に失敗しました");
    }
  };

  return (
    <>
      <div className="flex flex-col mt-[80px] items-center bg-[#F4F6F8]">
        {/* トースト表示用 */}
        <Toaster />

        <div className="m-[64px] w-[1312px] h-[816px] rounded-[16px] bg-white">
          <div className="flex w-[1312px] h-[66px] bg-[#1F6C7E] rounded-t-[16px] items-center gap-[16px] pl-[32px] text-[24px] text-white font-bold">
            <p>設定</p>
            <Image src="/arrow-r.svg" alt="arrow" width={28} height={28} />
            <p>ユーザーを追加</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center items-center gap-[40px] pt-[80px] pb-[33px] shadow-lg rounded-[16px]"
          >
            {/* 氏名 */}
            <div className="flex flex-col w-[664px]">
              <input
                type="text"
                placeholder="氏名"
                className={`h-[56px] w-full bg-[#D9D9D9] pl-[32px] rounded-[8px] ${errors.name ? "border-2 border-red-500" : ""}`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 ml-2">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* メールアドレス */}
            <div className="flex flex-col w-[664px]">
              <input
                type="email"
                placeholder="メールアドレス"
                className={`h-[56px] w-full bg-[#D9D9D9] pl-[32px] rounded-[8px] ${errors.email ? "border-2 border-red-500" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 ml-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 部署 */}
            <div className="flex flex-col w-[664px]">
              <select
                className={`h-[56px] w-full bg-[#D9D9D9] pl-[32px] rounded-[8px] ${errors.departmentId ? "border-2 border-red-500" : ""}`}
                {...register("departmentId")}
              >
                <option hidden value="">
                  部署
                </option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="text-red-500 text-sm mt-1 ml-2">
                  {errors.departmentId.message}
                </p>
              )}
            </div>

            {/* 役職 */}
            <div className="flex flex-col w-[664px]">
              <select
                className={`h-[56px] w-full bg-[#D9D9D9] pl-[32px] rounded-[8px] ${errors.roleId ? "border-2 border-red-500" : ""}`}
                {...register("roleId")}
              >
                <option hidden value="">
                  役職
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="text-red-500 text-sm mt-1 ml-2">
                  {errors.roleId.message}
                </p>
              )}
            </div>

            {/* 権限 */}
            <div className="w-[664px]">
              <div className="flex items-center gap-[80px]">
                <h3 className="text-[24px] font-bold">権限</h3>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="1"
                    className="w-6 h-6"
                    {...register("permissionId")}
                  />
                  <p className="ml-2 text-[24px] font-bold">管理者</p>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="2"
                    className="w-6 h-6"
                    {...register("permissionId")}
                  />
                  <p className="ml-2 text-[24px] font-bold">ユーザー</p>
                </label>
              </div>
              {errors.permissionId && (
                <p className="text-red-500 text-sm mt-1 ml-2">
                  {errors.permissionId.message}
                </p>
              )}
            </div>

            {/* パスワード */}
            <div className="flex flex-col w-[664px]">
              <input
                type="password"
                placeholder="初期パスワード"
                className={`h-[56px] w-full bg-[#D9D9D9] pl-[32px] rounded-[8px] ${errors.password ? "border-2 border-red-500" : ""}`}
                {...register("password")}
              />
              {/* パスワードのエラーや注釈は少し小さめに表示してレイアウト崩れを防ぐ */}
              {errors.password ? (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {errors.password.message}
                </p>
              ) : (
                <p className="text-gray-500 text-xs mt-1 ml-2">
                  ※8文字以上、英大・小・数・記号を含めてください
                </p>
              )}
            </div>

            {/* ボタンエリア */}
            <div className="flex gap-[184px] text-white text-[20px] font-bold items-center">
              {/* 戻るボタン：機能させるためにdivにonClickを追加するか、button type="button"推奨 */}
              <div
                onClick={() => router.back()}
                className="flex gap-[8px] w-[240px] h-[80px] bg-[#CB223F] justify-center items-center rounded-[16px] cursor-pointer hover:opacity-90 transition-opacity"
              >
                <Image
                  src="/back-arrow.svg"
                  alt="arrow"
                  width={24}
                  height={24}
                />
                <p>戻る</p>
              </div>

              {/* サーバーエラーがあればここに表示 */}
              {serverError && (
                <p className="text-red-500 text-sm font-bold absolute mt-[-40px]">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex gap-[8px] w-[240px] h-[80px] bg-[#1F6C7E] justify-center items-center rounded-[16px] disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                <Image src="/plus.svg" alt="plus" width={24} height={24} />
                <p>{isSubmitting ? "追加中..." : "追加"}</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
