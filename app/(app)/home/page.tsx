// app/(app)/home/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RemainingTime from "@/components/features/RemainingTime";

export default function Home() {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [pendingAppsCount, setPendingAppsCount] = useState<number>(0); // 自分の申請中
  const [waitingApprovalsCount, setWaitingApprovalsCount] = useState<number>(0); // 自分への承認待ち
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 3つのAPIを並列で処理する
        const [resTime, resApps, resApprovals] = await Promise.all([
          fetch("/api/me/remaining-leave"),
          fetch("/api/applications?status=pending"),
          fetch("/api/approvals"),
        ]);

        // 残余時間の処理
        if (resTime.ok) {
          const data = await resTime.json();
          setRemainingTime(Number(data.remaining_leave_hours));
        }

        // 自分の申請中件数
        if (resApps.ok) {
          const data = await resApps.json();
          setPendingAppsCount(data.length);
        }

        // 自分への承認待ち件数
        if (resApprovals.ok) {
          const data = await resApprovals.json();
          setWaitingApprovalsCount(data.length);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#F4F6F8] pt-48 text-center">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F4F6F8]">
      <div className="flex flex-col px-38 pt-24 pb-16 gap-12">
        {/* 申請ボタン */}
        <Link
          href="/home/application/new"
          className="h-28 bg-[#1F6C7E] flex justify-center items-center text-white text-4xl font-bold rounded-[16px] shadow-md shadow-black/60 hover:bg-[#21838e] cursor-pointer"
        >
          <p>申請する</p>
        </Link>

        {/* ダッシュボード・パネル群 */}
        <div className="w-full flex justify-center gap-16">
          {/* 申請中 (件数) */}
          <Link
            href="/home/application" // ★一覧ページへ飛ばす
            className="w-140 h-48 bg-[#1F6C7E] text-white text-2xl font-bold rounded-[16px] shadow-md shadow-black/60 relative hover:bg-[#21838e] cursor-pointer"
          >
            <img
              src="/Search.png"
              alt="Search"
              className="absolute top-4 right-4"
            />
            <p className="absolute top-4 left-4">申請中</p>
            <p className="absolute bottom-8 left-8 flex items-end">
              {/* ★Stateの値を表示 */}
              <span className="text-7xl leading-none">{pendingAppsCount}</span>
              <span className="text-3xl ml-1 leading-none">件</span>
            </p>
          </Link>

          {/* 承認待ち (件数) */}
          <Link
            href="/home/approvals" // ★承認一覧ページへ飛ばす
            className="w-140 h-48 bg-[#CB223F] text-white text-2xl font-bold rounded-[16px] shadow-md shadow-black/60 relative hover:bg-[#e04861] cursor-pointer"
          >
            <img
              src="/Read.png"
              alt="Read"
              className="absolute top-4 right-4"
            />
            <p className="absolute top-4 left-4">承認待ち</p>
            <p className="absolute bottom-8 left-8 flex items-end">
              {/* ★Stateの値を表示 */}
              <span className="text-7xl leading-none">
                {waitingApprovalsCount}
              </span>
              <span className="text-3xl ml-1 leading-none">件</span>
            </p>
          </Link>

          {/* 残り時間 (コンポーネントを利用) */}
          {/* ★ここをベタ書きからコンポーネントに置き換え */}
          <RemainingTime reminingTime={remainingTime} />
        </div>

        {/* 通知エリア (ここは静的でもOK) */}
        <div className="flex p-8 h-96 rounded-[16px] shadow-md shadow-black/60 bg-white">
          <div className="flex flex-col w-full gap-4">
            <p className="font-bold text-2xl">通知</p>
            <hr className="border-t border-gray-300 my-4" />
            {/* ... (通知の中身はそのまま) ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
