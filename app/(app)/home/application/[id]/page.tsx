// app/(app)/home/application/[id]
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import ApplicationDetailViewer from "@/components/features/applications/ApplicationDetailViewer";
import { FormComponent } from "@/types/template";

// 型定義
// ログの型定義
type ApprovalLog = {
  id: number;
  action: string;
  comment: string | null;
  acted_at: string;
  users: {
    name: string;
  };
};
type ApplicationDetail = {
  id: number;
  status: string;
  created_at: string;
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
  approval_logs?: ApprovalLog[];
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const THEME_COLOR = "#1F6C7E";

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/applications/${id}`);

        if (!res.ok) throw new Error("取得失敗");
        const data = await res.json();
        setDetail(data);
      } catch (error) {
        console.error(error);
        // alert("データの取得に失敗しました。");
        // router.push("/home/application");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, router]);

  const handleDelete = async () => {
    if (!detail) return;
    if (!window.confirm("本当に削除/取り下げを行いますか？")) return;

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "削除失敗");
      }

      toast.success("削除しました");
      router.push("/home/application");
      router.refresh();
    } catch (error) {
      toast.error("エラーが発生しました");
      console.error(error);
    }
  };
  if (loading) return <div className="p-10 text-center">読み込み中...</div>;
  if (!detail)
    return <div className="p-10 text-center">データが見つかりません</div>;
  // ステータスバッジの表示内容を決定する関数
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "承認済み",
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "remanded":
        return {
          label: "差し戻し",
          className: "bg-red-100 text-red-800 border-red-200",
        };
      case "pending":
        return {
          label: "承認待ち",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "draft":
        return {
          label: "下書き",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
      default:
        return { label: status, className: "bg-gray-100 text-gray-800" };
    }
  };

  const statusObj = detail
    ? getStatusBadge(detail.status)
    : { label: "", className: "" };

  // 編集可能なステータス ("draft" または "remanded")
  const isEditable = detail && ["draft", "remanded"].includes(detail.status);

  // 削除/取下可能なステータス
  const isDeletable =
    detail && ["draft", "pending", "remanded"].includes(detail.status);
  // ★追加: 最新の差し戻しログを探す（ステータスがremandedの時用）
  const latestRemandLog = detail.approval_logs?.find(
    (log) => log.action === "remanded"
  );

  // ★追加: アクション名の日本語化ヘルパー
  const getActionLabel = (action: string) => {
    if (action === "approve") return "承認";
    if (action === "remanded") return "差し戻し";
    return action;
  };
  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <Toaster />
      <div className="mb-4">
        <Link
          href="/home/application"
          className="text-gray-500 hover:text-gray-700"
        >
          &lt; 一覧に戻る
        </Link>
      </div>
      <h1
        className="text-2xl font-bold mb-8 pb-1 inline-block"
        style={{ borderBottom: `4px solid ${THEME_COLOR}` }}
      >
        申請詳細確認
      </h1>
      {/* ★追加: 差し戻し時の警告メッセージエリア */}
      {detail.status === "remanded" && latestRemandLog && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-md shadow-sm animate-fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-red-800">
                この申請は差し戻されました
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="font-bold mb-1">
                  {latestRemandLog.users.name} さんのコメント:
                </p>
                <p className="bg-white p-2 rounded border border-red-100">
                  {latestRemandLog.comment || "コメントなし"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 基本情報 */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">テンプレート名</p>
          <p className="font-bold text-lg">
            {detail.application_templates.name}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">申請日時</p>
          <p className="font-bold text-lg">
            {new Date(detail.created_at).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">ステータス</p>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold border ${statusObj.className}`}
          >
            {statusObj.label}
          </span>{" "}
        </div>
      </div>
      {/* 申請内容 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800">申請内容</h2>
        <ApplicationDetailViewer
          elements={detail.application_templates.template_elements}
          values={detail.application_values}
        />
      </div>
      {/* ★追加: 承認履歴エリア */}
      {detail.approval_logs && detail.approval_logs.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
            承認履歴
          </h2>
          <div className="space-y-4">
            {detail.approval_logs.map((log) => (
              <div key={log.id} className="flex gap-4 p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-700">
                      {log.users.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.acted_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${
                        log.action === "approve"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {getActionLabel(log.action)}
                    </span>
                  </div>
                  {log.comment && (
                    <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                      {log.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* アクションボタンエリア */}
      {(isEditable || isDeletable) && (
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end items-center gap-4">
          {/* 削除・取り下げボタン (デザインを赤背景に戻しました) */}
          {isDeletable && (
            <button
              onClick={handleDelete}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
            >
              {detail?.status === "pending" ? "申請を取り下げる" : "削除する"}
            </button>
          )}

          {/* 編集ボタン */}
          {isEditable && (
            <Link
              href={`/home/application/${id}/edit`}
              className="w-full sm:w-auto px-8 py-3 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
              style={{ backgroundColor: THEME_COLOR }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              内容を編集する
            </Link>
          )}
        </div>
      )}{" "}
    </main>
  );
}
