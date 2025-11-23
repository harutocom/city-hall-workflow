// app/(app)/home/approvals
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// APIレスポンスの型定義
type ApprovalItem = {
  id: number;
  acted_at: string | null;
  applications: {
    id: number;
    status: string;
    created_at: string;
    users: {
      name: string;
    };
    application_templates: {
      name: string;
    };
  };
};

export default function ApprovalsListPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 指定カラー
  const THEME_COLOR = "#1F6C7E";

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await fetch("/api/approvals");
        if (!res.ok) throw new Error("データ取得エラー");
        const data = await res.json();
        setApprovals(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovals();
  }, []);

  // 日付フォーマット関数 (YYYY/MM/DD HH:mm)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="p-10 text-center">読み込み中...</div>;
  }

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      {/* タイトル */}
      <h1
        className="text-2xl font-bold mb-8 pb-1 inline-block"
        style={{
          borderBottom: `4px solid ${THEME_COLOR}`,
        }}
      >
        承認一覧
      </h1>

      {/* テーブル */}
      <div className="w-full overflow-x-auto bg-white">
        <table
          className="w-full border-collapse"
          style={{ border: `1px solid ${THEME_COLOR}` }}
        >
          <thead>
            <tr className="text-white" style={{ backgroundColor: THEME_COLOR }}>
              <th className="p-3 font-bold border-r border-white w-1/5">
                申請者
              </th>
              <th className="p-3 font-bold border-r border-white w-1/4">
                申請日
              </th>
              <th className="p-3 font-bold border-r border-white w-1/5">
                テンプレート
              </th>
              <th className="p-3 font-bold border-r border-white">コメント</th>
              <th className="p-3 font-bold w-20"></th>
            </tr>
          </thead>
          <tbody>
            {approvals.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  現在、承認待ちの申請はありません。
                </td>
              </tr>
            ) : (
              approvals.map((item) => (
                <tr
                  key={item.id}
                  className="text-center text-gray-800"
                  style={{ borderBottom: `1px solid ${THEME_COLOR}` }}
                >
                  {/* 申請者 */}
                  <td
                    className="p-3"
                    style={{ borderRight: `1px solid ${THEME_COLOR}` }}
                  >
                    {item.applications.users.name}
                  </td>

                  {/* 申請日 */}
                  <td
                    className="p-3"
                    style={{ borderRight: `1px solid ${THEME_COLOR}` }}
                  >
                    {formatDate(item.applications.created_at)}
                  </td>

                  {/* テンプレート名 */}
                  <td
                    className="p-3"
                    style={{ borderRight: `1px solid ${THEME_COLOR}` }}
                  >
                    {item.applications.application_templates.name}
                  </td>

                  {/* コメント (APIに含まれていないため仮置き) */}
                  <td
                    className="p-3 text-left truncate max-w-xs"
                    style={{ borderRight: `1px solid ${THEME_COLOR}` }}
                  >
                    <span className="text-gray-400 text-sm text-center block">
                      -
                    </span>
                  </td>

                  {/* 詳細リンク */}
                  <td className="p-3">
                    <Link
                      href={`/home/approvals/${item.id}`}
                      className="text-blue-500 hover:underline font-medium"
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
    </main>
  );
}
