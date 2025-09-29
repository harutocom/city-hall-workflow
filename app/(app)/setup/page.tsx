import React from "react";

export default function Setup() {
  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col justify-center px-38 pt-48 pb-16">
      <div className="w-full flex flex-col">
        {/* アカウント情報 */}
        <div className="bg-[#1F6C7E] text-white text-xl font-bold px-8 py-4 rounded-t-xl">
          アカウント情報
        </div>

        <div className="bg-white shadow-md  border border-[#1F6C7E]">
          <div className="grid grid-cols-2 gap-y-4">
            <div className="border border-[#1F6C7E]">
              <p className="font-semibold text-sm">部署</p>
              <p className="font-semibold text-center mb-6">人事部</p>
            </div>
            <div className="border border-[#1F6C7E]">
              <p className="font-semibold text-sm">役職</p>
              <p className="font-semibold text-center mb-6">マネージャー</p>
            </div>
          </div>
        </div>

        {/* アカウント管理 */}
        <div className="bg-[#1F6C7E] text-white text-xl font-bold px-8 py-4 ">
          アカウント管理
        </div>
        <button className="flex items-center justify-between text-black hover:bg-[#DDDDDD] bg-white shadow-md p-6 border border-[#1F6C7E] font-bold">
          <span>パスワード変更</span>
          <img src="/Next.png" alt="Next" className="w-4 h-4" />
        </button>
        <button className="flex items-center justify-between text-red-600 hover:bg-[#DDDDDD] bg-white shadow-md p-6 border border-[#1F6C7E] font-bold ">
          <span>ログアウト</span>
          <img src="/Next.png" alt="Next" className="w-4 h-4" />
        </button>

        {/* 管理者権限 */}
        <div className="bg-[#1F6C7E] text-white text-xl font-bold px-8 py-4 ">
          管理者権限
        </div>
        <button className="flex items-center gap-2 justify-between text-000000 font-bold bg-white shadow-md border border-[#1F6C7E] p-6 hover:bg-[#DDDDDD]">
          <span>ユーザーを追加</span>
          <img src="/Plus.png" alt="Plus" className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 justify-between text-000000 font-bold bg-white shadow-md border border-[#1F6C7E] p-6 hover:bg-[#DDDDDD]">
          <span>ユーザーを編集</span>
          <img src="/Pen.png" alt="Pen" className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 justify-between text-000000 font-bold bg-white shadow-md border border-[#1F6C7E] p-6 hover:bg-[#DDDDDD]">
          <span>ユーザーを削除</span>
          <img src="/Trash.png" alt="Trash" className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 justify-between text-000000 font-bold bg-white shadow-md border border-[#1F6C7E] p-6 hover:bg-[#DDDDDD]">
          <span>テンプレート一覧</span>
          <img src="/Next.png" alt="Next" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}