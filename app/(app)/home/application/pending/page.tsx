// app/(app)/home/application/pending
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/NewButton";

// 型定義
type Application = {
  id: number;
  status: string;
  created_at: string;
  updated_at: string; // ★追加
  application_templates: { name: string };
};

export default function MyApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const THEME_COLOR = "#1F6C7E";

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch("/api/applications?status=pending");
        if (res.ok) {
          const data = await res.json();
          setApps(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ステータスのバッジ表示
  const renderStatus = (status: string) => {
    const styles = {
      approved: "bg-green-100 text-green-800",
      remanded: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      draft: "bg-gray-100 text-gray-800",
    };
    const labels = {
      approved: "承認済み",
      remanded: "差し戻し",
      pending: "承認待ち",
      draft: "下書き",
    };
    const s = status as keyof typeof styles;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${
          styles[s] || styles.draft
        }`}
      >
        {labels[s] || status}
      </span>
    );
  };

  if (loading) return <div className="p-10 text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* ヘッダーエリア */}
        <div className="flex justify-between items-end mb-8">
          <h1
            className="text-2xl font-bold pb-1 inline-block"
            style={{ borderBottom: `4px solid ${THEME_COLOR}` }}
          >
            申請中一覧
          </h1>

          {/* 新規作成ボタン */}
          <Link href="/home/application/new">
            <Button
              variant="default"
              className="bg-[#1F6C7E] hover:bg-[#165a6a] px-6"
            >
              ＋ 新規申請
            </Button>
          </Link>
        </div>

        {/* 一覧テーブル */}
        <div className="w-full overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
          <table
            className="w-full border-collapse"
            style={{ border: `1px solid ${THEME_COLOR}` }}
          >
            <thead>
              <tr
                className="text-white"
                style={{ backgroundColor: THEME_COLOR }}
              >
                <th className="p-3 font-bold border-r border-white text-center">
                  ID
                </th>
                <th className="p-3 font-bold border-r border-white text-center w-1/4">
                  テンプレート名
                </th>
                <th className="p-3 font-bold border-r border-white text-center">
                  作成日時
                </th>
                <th className="p-3 font-bold border-r border-white text-center">
                  最終更新日時
                </th>
                <th className="p-3 font-bold border-r border-white text-center">
                  ステータス
                </th>
                <th className="p-3 font-bold w-24 text-center">詳細</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {apps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500">
                    申請履歴はありません。
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors text-center"
                    style={{ borderBottom: `1px solid ${THEME_COLOR}` }}
                  >
                    <td
                      className="p-3"
                      style={{ borderRight: `1px solid ${THEME_COLOR}` }}
                    >
                      {app.id}
                    </td>
                    <td
                      className="p-3 font-medium"
                      style={{ borderRight: `1px solid ${THEME_COLOR}` }}
                    >
                      {app.application_templates.name}
                    </td>
                    <td
                      className="p-3"
                      style={{ borderRight: `1px solid ${THEME_COLOR}` }}
                    >
                      {formatDate(app.created_at)}
                    </td>
                    <td
                      className="p-3"
                      style={{ borderRight: `1px solid ${THEME_COLOR}` }}
                    >
                      {formatDate(app.updated_at)}
                    </td>
                    <td
                      className="p-3"
                      style={{ borderRight: `1px solid ${THEME_COLOR}` }}
                    >
                      {renderStatus(app.status)}
                    </td>
                    <td className="p-3">
                      {/* 詳細ページへのリンク (承認詳細ページを流用する場合はパス注意) */}
                      {/* 今回は自分の申請詳細APIを作っていないので、一旦仮リンクか、承認詳細と同じ画面へ */}
                      <Link
                        href={`/home/application/${app.id}`}
                        className="text-blue-500 hover:underline font-bold"
                      >
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
