// components/features/applications/ApplicationDetailViewer.tsx
import React from "react";
import { FormComponent } from "@/types/template"; // 型定義は適宜合わせてください

// 既存の部品コンポーネントを再利用
import Check from "../Check";
import DateInput from "../DateInput";
import DateRange from "../DateRange";
import Radio from "../Radio";
import Select from "../Select";
import TextArea from "../TextArea";
import TextEntry from "../TextEntry";

// FormComponent に sort_order が無いので、ここで合体させる
type DetailElement = FormComponent & {
  sort_order: number;
};

// 受け取るデータの型
interface ApplicationDetailViewerProps {
  elements: DetailElement[]; // テンプレートの構造 (template_elements)
  values: {
    // 申請された値 (application_values)
    sort_order: number;
    value_text: string | null;
    value_number: number | null;
    value_datetime: string | null;
    value_boolean: boolean | null;
  }[];
}

export default function ApplicationDetailViewer({
  elements,
  values,
}: ApplicationDetailViewerProps) {
  // 申請値の中から、特定の項目の値を探し出して整形する関数
  const getDisplayValue = (sortOrder: number) => {
    const val = values.find((v) => v.sort_order === sortOrder);
    if (!val) return ""; // 値がない場合

    // 値が入っているカラムを優先順位順に返す
    if (val.value_text !== null) return val.value_text;
    if (val.value_number !== null) return val.value_number;
    if (val.value_datetime !== null) return val.value_datetime; // 必要なら new Date()... で整形
    if (val.value_boolean !== null) return val.value_boolean;

    return "";
  };

  // コンポーネントの出し分けロジック (FormBuilderCanvasから流用・改造)
  const renderReadOnlyComponent = (component: DetailElement) => {
    const props = component.props || {};

    // DBから取得した値を特定
    const displayValue = getDisplayValue(component.sort_order);

    // ★重要: 各コンポーネントに value (初期値) を渡し、disabled (編集不可) にする
    // ※ 子コンポーネント側(TextEntryなど)が value や disabled を受け取れるようにしておく必要があります
    const commonProps = {
      ...props,
      value: displayValue, // 値を注入
      defaultValue: displayValue, //念のため
      disabled: true, // 編集不可にする
      readOnly: true, // 読み取り専用
      className: "bg-gray-50 cursor-not-allowed", // スタイル調整（任意）
    };

    switch (component.component_name) {
      case "text":
        return (
          <TextEntry
            {...commonProps}
            // ★ここで上書き！
            // null や undefined なら空文字に、true/false なら "true"/"false" という文字列に変換
            value={String(commonProps.value ?? "")}
          />
        );
      case "textarea":
        return <TextArea {...commonProps} />;
      case "select":
        // Selectの場合、valueに選択肢の値を渡せば自動で選択状態になるはず
        return <Select {...commonProps} />;
      case "radio":
        // Radioの場合、checked判定が必要かもしれないが、valueを渡して制御できればベスト
        return <Radio {...commonProps} />;
      case "checkbox":
        // Checkboxの場合、booleanなら checked プロパティに変換が必要かも
        return <Check {...commonProps} checked={displayValue === true} />;
      case "date":
        // 日付文字列を渡す
        return <DateInput {...commonProps} />;
      case "date_range":
        return <DateRange {...commonProps} />;
      default:
        return <div className="text-gray-400">-</div>;
    }
  };

  return (
    <div className="space-y-6">
      {elements.map((element) => (
        <div
          key={element.id}
          className="border-b border-gray-100 pb-6 last:border-0"
        >
          {/* ここでレンダリング */}
          {renderReadOnlyComponent(element)}
        </div>
      ))}
    </div>
  );
}
