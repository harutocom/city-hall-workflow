// componets/features/templates-bilder/FormComponentPalette.tsx

import { FormComponentType } from "@/types/template";

interface FormComponentPaletteProps {
  // ユーザーが部品ボタンをクリックしたときに呼び出す関数
  onAddComponent: (type: FormComponentType) => void;
}

interface PaletteItem {
  type: FormComponentType;
  label: string;
  description: string;
}

// パレットに表示するコンポーネントのデータ
const PALETTE_ITEMS: PaletteItem[] = [
  {
    type: "text",
    label: "テキスト入力",
    description: "一行のテキストを入力",
  },
  {
    type: "textarea",
    label: "テキストエリア",
    description: "複数行のテキスト入力",
  },
  {
    type: "select",
    label: "選択肢",
    description: "プルダウンメニュー",
  },
  {
    type: "radio",
    label: "ラジオボタン",
    description: "単一選択",
  },
  {
    type: "checkbox",
    label: "チェックボックス",
    description: "複数選択",
  },
  {
    type: "date",
    label: "日付選択",
    description: "日付の選択",
  },
  {
    type: "date_range",
    label: "日付範囲選択",
    description: "日付範囲の選択",
  },
  {
    type: "date_time_range",
    label: "日時範囲選択",
    description: "日時範囲の選択",
  },
];

/**
 * フォームビルダーの左側に配置する、追加可能なフォーム部品の一覧パレット
 * @param onAddComponent - 部品ボタンがクリックされたときに呼び出されるコールバック関数
 */

export default function FormComponentPalette({
  onAddComponent,
}: FormComponentPaletteProps) {
  return (
    <aside className="h-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="bg-[#1F6C7E] text-white font-semibold py-2 px-4 rounded-t-lg">
        フォーム部品
      </div>
      <div className="p-3 space-y-2">
        {PALETTE_ITEMS.map((item) => (
          <button
            key={item.type}
            onClick={() => onAddComponent(item.type)}
            className="w-full flex items-center p-3 text-left bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008080] transition-all"
          >
            <div>
              <p className="font-semibold text-gray-800">{item.label}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
