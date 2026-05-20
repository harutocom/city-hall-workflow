"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Setup() {
  const { data: session } = useSession();
  const router = useRouter();
  const permissions =
    session?.user?.permission_names?.join(", ") || "権限情報なし";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };
  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col px-38 pt-16 pb-16">
      <div className="w-full flex flex-col">
        {/* アカウント情報 */}
        <div className="bg-[#1F6C7E] text-white text-xl font-bold px-8 py-4 rounded-t-xl">
          アカウント情報
        </div>

        <div className="bg-white shadow-md  border border-[#1F6C7E]">
          <div className="grid grid-cols-3 gap-y-4">
            <div className="border border-[#1F6C7E] p-4 flex flex-col items-center justify-center">
              <p className="font-semibold text-sm mb-2 text-gray-600">部署</p>
              <p className="font-bold text-center text-sm">
                {session?.user?.department_name || "---"}
              </p>
            </div>
            <div className="border border-[#1F6C7E] p-4 flex flex-col items-center justify-center">
              <p className="font-semibold text-sm mb-2 text-gray-600">役職</p>
              <p className="font-bold text-center text-sm">
                {session?.user?.role_name || "---"}
              </p>
            </div>
            {/* ★追加: 権限の表示 */}
            <div className="border border-[#1F6C7E] p-4 flex flex-col items-center justify-center">
              <p className="font-semibold text-sm mb-2 text-gray-600">
                保有権限
              </p>
              <p className="font-bold text-center text-sm">{permissions}</p>
            </div>
          </div>
        </div>

        {/* アカウント管理 */}
        <div className="bg-[#1F6C7E] text-white text-xl font-bold px-8 py-4 ">
          アカウント管理
        </div>
        <Link
          href="/settings/changePassword"
          className="flex items-center justify-between text-black hover:bg-[#DDDDDD] bg-white shadow-md p-6 border border-[#1F6C7E] font-bold"
        >
          <span>パスワード変更</span>
          <img src="/Next.png" alt="Next" className="w-4 h-4" />
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center justify-between text-red-600 hover:bg-[#DDDDDD] bg-white shadow-md p-6 border border-[#1F6C7E] font-bold"
        >
          <span>ログアウト</span>
          <img src="/Next.png" alt="Next" className="w-4 h-4" />
        </button>

        {/* 管理者権限 */}
        <div className="bg-[#1F6C7E] text-white text-xl font-bold px-8 py-4 ">
          管理者権限
        </div>
        <Link
          href="/settings/users"
          className="flex items-center gap-2 justify-between text-black font-bold bg-white shadow-md border border-[#1F6C7E] p-6 hover:bg-[#DDDDDD]"
        >
          <span>ユーザー一覧</span>
          <img src="/Next.png" alt="Next" className="w-4 h-4" />
        </Link>
        <Link
          href="/settings/templates"
          className="flex items-center gap-2 justify-between text-black font-bold bg-white shadow-md border border-[#1F6C7E] p-6 hover:bg-[#DDDDDD]"
        >
          <span>テンプレート一覧</span>
          <img src="/Next.png" alt="Next" className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
