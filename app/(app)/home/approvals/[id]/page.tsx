"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// 作成したコンポーネントをインポート
import ApplicationDetailViewer from "@/componets/featurses/applications/ApplicationDetailViewer";
import { FormComponent } from "@/types/template";

// 型定義 (APIのレスポンスに合わせる)
type ApprovalDetail = {
  id: number;
  applications: {
    status: string;
    created_at: string;
    users: { name: string; department_id: number };
    // API修正で elements が取れるようになる
    application_templates: {
      name: string;
      template_elements: (FormComponent & { sort_order: number })[];
    };
    application_values: {
      id: number;
      sort_order: number;
      value_text: string | null;
      value_number: number | null;
      value_datetime: string | null;
      value_boolean: boolean | null;
    }[];
  };
};

export default function ApprovalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [detail, setDetail] = useState<ApprovalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(false);

  const THEME_COLOR = "#1F6C7E";

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/approvals/${id}`);
        if (!res.ok) throw new Error("取得失敗");
        const data = await res.json();
        setDetail(data);
      } catch (error) {
        console.error(error);
        alert("データの取得に失敗しました。");
        router.push("/home/approvals");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, router]);

  const handleAction = async (action: "approve" | "remand") => {
    if (!confirm(action === "approve" ? "承認しますか？" : "差し戻しますか？"))
      return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/approvals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          comment:
            comment ||
            (action === "approve" ? "承認しました" : "修正してください"),
        }),
      });

      if (!res.ok) throw new Error("処理失敗");

      alert(action === "approve" ? "承認が完了しました！" : "差し戻しました。");
      router.push("/home/approvals");
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました。");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center">読み込み中...</div>;
  if (!detail)
    return <div className="p-10 text-center">データが見つかりません</div>;

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-4">
        <Link href="/home/approvals" className="text-gray-500 hover:text-gray-700">
          &lt; 一覧に戻る
        </Link>
      </div>

      <h1
        className="text-2xl font-bold mb-8 pb-1 inline-block"
        style={{ borderBottom: `4px solid ${THEME_COLOR}` }}
      >
        申請詳細確認
      </h1>

      {/* 基本情報 */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">申請者</p>
          <p className="font-bold text-lg">{detail.applications.users.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">申請日時</p>
          <p className="font-bold text-lg">
            {new Date(detail.applications.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ★ここに作成した ApplicationDetailViewer を配置！ */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800">申請内容</h2>
        <ApplicationDetailViewer
          elements={detail.applications.application_templates.template_elements}
          values={detail.applications.application_values}
        />
      </div>

      {/* 決裁エリア（ボタン） */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">決裁処理</h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            コメント (任意)
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1F6C7E] focus:outline-none"
            rows={3}
            placeholder="承認または差し戻しの理由を入力..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* ボタンエリア (画像のレイアウト風) */}
        <div className="flex justify-end gap-4">
          {/* 差し戻し (リセット風の赤) */}
          <button
            onClick={() => handleAction("remand")}
            disabled={processing}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded text-white font-bold transition-all
              ${
                processing
                  ? "bg-gray-400"
                  : "bg-[#DC2626] hover:bg-red-700 shadow-md active:translate-y-0.5"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
            差し戻し
          </button>

          {/* 承認 (送信風の青緑) */}
          <button
            onClick={() => handleAction("approve")}
            disabled={processing}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded text-white font-bold transition-all
              ${
                processing
                  ? "bg-gray-400"
                  : "bg-[#1F6C7E] hover:opacity-90 shadow-md active:translate-y-0.5"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            承 認
          </button>
        </div>
      </div>
    </main>
  );
}
