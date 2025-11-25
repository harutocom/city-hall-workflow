// app/(app)/home/application/[id]
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ApplicationDetailViewer from "@/components/features/applications/ApplicationDetailViewer";
import { FormComponent } from "@/types/template";

// 型定義
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
  // 承認者情報なども表示したければここに追加
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

  if (loading) return <div className="p-10 text-center">読み込み中...</div>;
  if (!detail)
    return <div className="p-10 text-center">データが見つかりません</div>;

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
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
            className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold 
            ${
              detail.status === "approved"
                ? "bg-green-100 text-green-800"
                : detail.status === "remanded"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {detail.status === "approved"
              ? "承認済み"
              : detail.status === "remanded"
              ? "差し戻し"
              : "承認待ち"}
          </span>
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
    </main>
  );
}
