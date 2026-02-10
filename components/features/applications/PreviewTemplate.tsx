"use client";

import { useState, useEffect } from "react";
import { FormComponent } from "@/types/template";

// コンポーネント群をインポート
import TextEntry from "../TextEntry";
import Select from "../Select";
import Check from "../Check";
import Radio from "../Radio";
import TextArea from "../TextArea";
import DateInput from "../DateInput";
import DateRange from "../DateRange";
import DateTimeRange from "../DateTimeRange";

interface TemplateDetail {
  id: number;
  name: string;
  description: string | null;
  template_elements: FormComponent[];
}

interface PreviewTemplateProps {
  templateId: string;
  // ★追加: 親からStateを受け取るためのProps
  answers: Record<number, any>;
  onAnswerChange: (sortOrder: number, value: any) => void;
}

export default function PreviewTemplate({
  templateId,
  answers,
  onAnswerChange,
}: PreviewTemplateProps) {
  const [template, setTemplate] = useState<TemplateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- テンプレート取得ロジック (メンバーのコードそのまま) ---
  useEffect(() => {
    if (!templateId) {
      setIsLoading(false);
      return;
    }
    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/templates/${templateId}`);
        if (!response.ok) throw new Error("テンプレート取得失敗");
        const data = await response.json();
        setTemplate(data || null); // データ構造に合わせて調整
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplate();
  }, [templateId]);

  // --- コンポーネントレンダリング関数 (入力対応版) ---
  const renderInputComponent = (
    component: FormComponent & { sort_order: number },
  ) => {
    const commonProps = {
      ...component.props,
      disabled: false, // 入力画面なので編集可能
      // ★現在の値を渡す
      value: answers[component.sort_order],
      // ★変更を受け取る
      onChange: (e: any) => {
        // inputタグなら e.target.value, それ以外(DateRangeなど)なら e を直接値とする
        const val = e?.target ? e.target.value : e;
        onAnswerChange(component.sort_order, val);
      },
    };

    // 種類に応じてコンポーネントを出し分け
    switch (component.component_name) {
      case "text":
        // TextEntryのonChange対応が必要ならここで吸収
        return <TextEntry {...commonProps} />;
      case "textarea":
        return <TextArea {...commonProps} />;
      case "select":
        return <Select {...commonProps} />;
      case "radio":
        return <Radio {...commonProps} />;
      case "checkbox":
        return <Check {...commonProps} />;
      case "date":
        return <DateInput {...commonProps} />;
      case "date_range":
        return <DateRange {...commonProps} />;
      case "date_time_range":
        return <DateTimeRange {...commonProps} />;

      default:
        return (
          <p className="text-red-500">未対応: {component.component_name}</p>
        );
    }
  };

  if (isLoading) return <p className="text-center py-8">読み込み中...</p>;
  if (error) return <p className="text-red-600 text-center py-8">{error}</p>;
  if (!template)
    return <p className="text-center py-8">テンプレートが見つかりません。</p>;

  return (
    <section>
      <div className="bg-gray-100 p-8 border border-gray-200 rounded-lg shadow-inner">
        <div className="bg-white p-8 space-y-6 rounded-md">
          {template.template_elements.length > 0 ? (
            template.template_elements.map((component: any) => (
              <div key={component.id}>
                {/* ★ここを変更 */}
                {renderInputComponent(component)}
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
  );
}
