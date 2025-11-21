"use client";
import { FormComponent } from "@/types/template";
import { useState, useEffect } from "react";
import { renderComponentPreview } from "@/app/(app)/settings/templates/[id]/page";

interface TemplateDetail {
  id: number;
  name: string;
  description: string | null;
  template_elements: FormComponent[];
}

interface PreviewTemplateProps {
  templateId: string;
}

// コンポーネントの引数を修正
export default function PreviewTemplate({ templateId }: PreviewTemplateProps) {
  const id = templateId;

  const [template, setTemplate] = useState<TemplateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- データ取得ロジック ---
  useEffect(() => {
    // propsとしてIDが渡されているかチェック
    if (!id) {
      setIsLoading(false);
      setError("プレビューするテンプレートIDが指定されていません。");
      return;
    }

    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/templates/${id}`);
        if (!response.ok) {
          throw new Error(
            `テンプレートの取得に失敗しました (Status: ${response.status})。`
          );
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

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p className="text-red-600">エラー: {error}</p>;
  }

  if (!template) {
    return <p>テンプレート情報が見つかりませんでした。</p>;
  }

  return (
    <>
      <section>
        <div className="bg-gray-100 p-8 border border-gray-200 rounded-lg shadow-inner">
          <div className="bg-white p-8 space-y-6 rounded-md">
            {template.template_elements.length > 0 ? (
              template.template_elements.map((component) => (
                <div key={component.id}>
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
    </>
  );
}
