<<<<<<< HEAD
import React from "react";
import Link from "next/link";

const Header = () => {
=======
// components/header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  // セッション情報（ログイン中のユーザー情報）を取得
  const { data: session } = useSession();

  // ユーザー名の頭文字を取得（なければ "U"）
  const initial = session?.user?.name?.charAt(0) || "U";

>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
  return (
    <header className="fixed w-full h-16 px-6 py-2 bg-[#1F6C7E] flex justify-between border-b border-gray-200 z-50 rounded-br-[16px] shadow-md shadow-black/60 relative">
      <img src="/logo.png" alt="Logo" />

      <Link
        href="/home"
<<<<<<< HEAD
        className="absolute right-104 top-5 flex items-center gap-2 cursor-pointer"
=======
        className="absolute right-120 top-5 flex items-center gap-2 cursor-pointer"
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
      >
        <img src="/Home.png" alt="home" className="w-4 h-4" />
        <p className="text-white">ホーム</p>
      </Link>

      <Link
<<<<<<< HEAD
        href="/history"
        className="absolute right-72 top-5 flex items-center gap-2 cursor-pointer"
=======
        href="/home/application"
        className="absolute right-92 top-5 flex items-center gap-2 cursor-pointer"
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
      >
        <img src="/History.png" alt="history" className="w-4 h-4" />
        <p className="text-white">申請履歴</p>
      </Link>

      <Link
<<<<<<< HEAD
        href="/setting"
        className="absolute right-40 top-5 flex items-center gap-2 cursor-pointer"
=======
        href="/settings"
        className="absolute right-64 top-5 flex items-center gap-2 cursor-pointer"
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
      >
        <img src="/Setting.png" alt="setting" className="w-4 h-4" />
        <p className="text-white">個人設定</p>
      </Link>

<<<<<<< HEAD
      <Link
        href="/login"
=======
      {session?.user && (
        <div className="absolute right-[130px] top-3.5 flex items-center gap-2 bg-[#165a6a] px-3 py-1.5 rounded-full border border-[#4aa4b9]/30">
          {/* 簡易アバター */}
          <div className="w-6 h-6 rounded-full bg-white text-[#1F6C7E] flex items-center justify-center font-bold text-xs shadow-sm">
            {initial}
          </div>
          {/* ユーザー名 */}
          <p className="text-white text-sm font-medium max-w-[100px] truncate">
            {session.user.name}
          </p>
        </div>
      )}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
        className="absolute right-8 top-5 flex items-center gap-2 cursor-pointer"
      >
        <img src="/Lock.png" alt="logout" className="w-4 h-4" />
        <p className="text-white">ログアウト</p>
<<<<<<< HEAD
      </Link>
=======
      </button>
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
    </header>
  );
};

export default Header;
