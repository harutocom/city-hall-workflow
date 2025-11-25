"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const Header = () => {
  return (
    <header className="fixed w-full h-16 px-6 py-2 bg-[#1F6C7E] flex justify-between border-b border-gray-200 z-50 rounded-br-[16px] shadow-md shadow-black/60 relative">
      <img src="/logo.png" alt="Logo" />

      <Link
        href="/home"
        className="absolute right-104 top-5 flex items-center gap-2 cursor-pointer"
      >
        <img src="/Home.png" alt="home" className="w-4 h-4" />
        <p className="text-white">ホーム</p>
      </Link>

      <Link
        href="/home/application"
        className="absolute right-72 top-5 flex items-center gap-2 cursor-pointer"
      >
        <img src="/History.png" alt="history" className="w-4 h-4" />
        <p className="text-white">申請履歴</p>
      </Link>

      <Link
        href="/settings"
        className="absolute right-40 top-5 flex items-center gap-2 cursor-pointer"
      >
        <img src="/Setting.png" alt="setting" className="w-4 h-4" />
        <p className="text-white">個人設定</p>
      </Link>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="absolute right-8 top-5 flex items-center gap-2 cursor-pointer"
      >
        <img src="/Lock.png" alt="logout" className="w-4 h-4" />
        <p className="text-white">ログアウト</p>
      </button>
    </header>
  );
};

export default Header;
