// app/(app)/settings/templates/[id]/page.tsx
// テンプレートの詳細情報を取得するページ

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

// --- 型定義 ---
import { FormComponent } from "@/types/template";

// --- プレビューコンポーネントをインポート ---
import Check from "@/componets/featurses/Check";
import DateInput from "@/componets/featurses/DateInput";
import DateRange from "@/componets/featurses/DateRange";
import Radio from "@/componets/featurses/Radio";
import Select from "@/componets/featurses/Select";
import TextArea from "@/componets/featurses/TextArea";
import TextEntry from "@/componets/featurses/TextEntry";

// APIから取得するテンプレート詳細データの型
interface TemplateDetail {
  id: number;
  name: string;
  description: string | null;
  template_elements: FormComponent[];
}

// 部品の種類に応じて描画するコンポーネントを決定する関数
export const renderComponentPreview = (component: FormComponent) => {
  const props = component.props || {};
  switch (component.component_name) {
    case "text":
      return <TextEntry {...props} />;
    case "textarea":
      return <TextArea {...props} />;
    case "select":
      return <Select {...props} />;
    case "radio":
      return <Radio {...props} />;
    case "checkbox":
      return <Check {...props} />;
    case "date":
      return <DateInput {...props} />;
    case "date_range":
      return <DateRange {...props} />;
    default:
      return (
        <div className="text-red-500">
          未対応のコンポーネント: {component.component_name}
        </div>
      );
  }
};

export default function TemplateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // --- 状態管理 ---
  const [template, setTemplate] = useState<TemplateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- データ取得ロジック ---
  useEffect(() => {
    if (!id) return;

    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/templates/${id}`);
        if (!response.ok) {
          throw new Error("テンプレートの取得に失敗しました。");
        }
        const data = await response.json();
        setTemplate(data.template);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "不明なエラーが発生しました。"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

  // --- 削除処理ロジック ---
  const handleDelete = async () => {
    if (!template) return; // テンプレートが無かったら何もしない

    // 確認ウィンドウを表示
    if (!window.confirm(`「${template.name}」を本当に削除しますか？`)) {
      return; // キャンセルなら中断
    }

    toast.loading("テンプレートを削除中...");
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
      });
      toast.dismiss();
      if (response.status !== 204) {
        throw new Error("削除に失敗しました。");
      }
      toast.success("テンプレートを削除しました。");
      router.push("/settings/templates");
      router.refresh();
    } catch (err) {
      toast.dismiss();
      toast.error(
        err instanceof Error ? err.message : "不明なエラーが発生しました。"
      );
    }
  };

  // --- レンダリング中の表示 ---
  if (isLoading) return <div className="p-8 text-center">読み込み中...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500">エラー: {error}</div>;
  if (!template)
    return (
      <div className="p-8 text-center">テンプレートが見つかりません。</div>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Toaster position="top-center" />

      {/* --- ヘッダー：タイトルとアクションボタン --- */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold">{template.name}</h1>
          <p className="text-gray-500 mt-1">テンプレート詳細</p>
        </div>
        <div className="flex gap-4">
          <Link href={`/settings/templates/${id}/edit`}>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#1F6C7E] text-white font-semibold rounded-lg shadow-md hover:bg-[#006666] transition-colors">
              編集
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
          >
            削除
          </button>
        </div>
      </header>

      {/* --- 説明セクション --- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          テンプレートの説明
        </h2>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-md min-h-[100px] border">
          {template.description || "説明はありません。"}
        </p>
      </section>

      {/* --- プレビューセクション --- */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">プレビュー</h2>
        <div className="bg-gray-100 p-8 border border-gray-200 rounded-lg shadow-inner">
          <div className="bg-white p-8 space-y-6 rounded-md">
            {template.template_elements.length > 0 ? (
              template.template_elements.map((component) => (
                <div key={component.id}>
                  {" "}
                  {/* DBのidがない場合に備えてsort_orderをフォールバック */}
                  {renderComponentPreview(component)}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                フォーム部品がありません。
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
