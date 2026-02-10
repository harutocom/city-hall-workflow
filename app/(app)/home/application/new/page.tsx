// app/(app)/home/application/new
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- APIから返ってくるデータの型定義 ---
// APIのselect句に合わせて型を定義します
interface Template {
  id: number;
  name: string;
  updated_at: string;
  description: string | null;
  users: {
    name: string | null;
  };
}

/**
 * 日付文字列を 'YYYY/MM/DD HH:mm' 形式にフォーマットするヘルパー関数
 * @param dateString ISO形式の日付文字列
 */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

export default function TemplateListPage() {
  const router = useRouter();

  // --- 状態管理 ---
  const [templates, setTemplates] = useState<Template[]>([]); // テンプレートのリスト
  const [isLoading, setIsLoading] = useState<boolean>(true); // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラーメッセージ

  // --- データ取得ロジック ---
  useEffect(() => {
    // ページが読み込まれた時にAPIからデータを取得する
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/templates");
        if (!response.ok) {
          throw new Error("データの取得に失敗しました。");
        }

        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "不明なエラーが発生しました。",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []); // 空の配列を渡すことで、コンポーネントのマウント時に一度だけ実行される

  // --- レンダリング ---

  // ローディング中の表示
  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  // エラー発生時の表示
  if (error) {
    return <div className="p-8 text-center text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold border-l-4 border-[#008080] pl-4">
          テンプレート一覧
        </h1>
      </header>

      {/* テンプレート一覧テーブル */}
      <div className="shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-[#008080] text-white">
            <tr>
              <th className="py-3 px-6 text-left">テンプレート名</th>
              <th className="py-3 px-6 text-left">作成者名</th>
              <th className="py-3 px-6 text-left">最終編集日時</th>
              <th className="py-3 px-6 text-left">説明</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {templates.map((template) => (
              <tr
                key={template.id}
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  router.push(`/home/application/new/${template.id}`)
                } // あとで詳細ページへの遷移を追加
              >
                <td className="py-4 px-6 font-medium">{template.name}</td>
                <td className="py-4 px-6">{template.users?.name || "N/A"}</td>
                <td className="py-4 px-6">{formatDate(template.updated_at)}</td>
                <td className="py-4 px-6 text-sm">{template.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {templates.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            テンプレートがまだ作成されていません。
          </div>
        )}
      </div>
    </div>
  );
}
