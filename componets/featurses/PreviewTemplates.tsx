"use client";
import { FormComponent } from "@/types/template";
import { useState, useEffect } from "react";
import { renderComponentPreview } from "@/app/(app)/settings/templates/[id]/page";
import { useParams, useRouter } from "next/navigation";

interface TemplateDetail {
  id: number;
  name: string;
  description: string | null;
  template_elements: FormComponent[];
}

export default function PreviewTemplate() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
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
  if (!template) {
    return <p>読み込み中...</p>;
  }

  return (
    <>
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
    </>
  );
}
