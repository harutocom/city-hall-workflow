// componets/features/templates-bilder/SettingsPanel.tsx

"use client";

import { FormComponent, ComponentProps, Option } from "@/types/template";

// --- このコンポーネントが親から受け取るPropsの型定義 ---
interface SettingsPanelProps {
  // 選択中の部品オブジェクト。何も選択されていなければnull
  selectedComponent: FormComponent | null;
  // 部品のプロパティが更新されたときに親に通知する関数
  onUpdateComponent: (id: string, newProps: Partial<FormComponent>) => void;
}

/**
 * 選択しているパーツの設定を行うコンポーネント
 * @param selectedComponent - 選択中のコンポーネント
 * @param onUpdateComponent - コンポーネントの設定を入力されたものに更新する関数
 */

export default function SettingsPanel({
  selectedComponent,
  onUpdateComponent,
}: SettingsPanelProps) {
  // --- 何も選択されていない場合の表示 ---
  if (!selectedComponent) {
    return (
      <aside className="h-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="bg-[#1F6C7E] text-white py-2 px-4 font-semibold text-center">
          設定
        </div>
        <div className="flex justify-center h-full pt-[50px] text-gray-500">
          <p>プレビュー上の部品を選択して設定を開始</p>
        </div>
      </aside>
    );
  }

  // --- イベントハンドラ ---

  /**
   *propsを入力されたpropsにonUpdateComponentを使い更新する関数
   * @param key
   * @param value
   */
  const handlePropsChange = (key: keyof ComponentProps, value: any) => {
    const newProps = { ...selectedComponent.props, [key]: value };
    onUpdateComponent(selectedComponent.id, { props: newProps });
  };

  // 選択肢を追加する関数

  /**
   * チェックボックスやラジオボタンなどの選択肢を追加する関数
   */
  const handleAddOption = () => {
    const newOption: Option = {
      label: "新しい選択肢",
      value: `option_${Date.now()}`,
    };
    const currentOptions = selectedComponent.props.options || [];
    handlePropsChange("options", [...currentOptions, newOption]);
  };

  /**
   * チェックボックスやラジオボタンなどの選択肢を更新する関数
   * @param index - 更新したい選択肢のindex
   * @param newLabel - 新しい選択肢のlabel
   */
  const handleUpdateOption = (index: number, newLabel: string) => {
    const newOptions = [...(selectedComponent.props.options || [])];
    newOptions[index] = {
      ...newOptions[index],
      label: newLabel,
      value: newLabel,
    }; // valueもlabelと同期させる簡単な実装
    handlePropsChange("options", newOptions);
  };

  /**
   * チェックボックスやラジオボタンの選択肢を消す関数
   * @param index - 消したい選択肢のindex
   */
  const handleDeleteOption = (index: number) => {
    const newOptions = (selectedComponent.props.options || []).filter(
      (_, i) => i !== index
    );
    handlePropsChange("options", newOptions);
  };

  return (
    <aside className="h-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="bg-[#1F6C7E] py-2 px-4 text-white font-semibold text-center">
        設定
      </div>

      <div className="p-4 space-y-6">
        {/* --- 選択中の部品表示 --- */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="font-bold text-blue-800">
            {selectedComponent.component_name}
          </p>
          <p className="text-sm text-blue-600">選択中の部品</p>
        </div>

        {/* --- 共通の設定項目 --- */}
        <div>
          <label
            htmlFor="label-setting"
            className="block text-sm font-medium text-gray-700"
          >
            ラベル名
          </label>
          <input
            id="label-setting"
            type="text"
            value={selectedComponent.props.label || ""}
            onChange={(e) => handlePropsChange("label", e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* --- プレースホルダー (特定の部品のみ表示) --- */}
        {["text", "textarea", "select"].includes(
          selectedComponent.component_name
        ) && (
          <div>
            <label
              htmlFor="placeholder-setting"
              className="block text-sm font-medium text-gray-700"
            >
              プレースホルダー
            </label>
            <input
              id="placeholder-setting"
              type="text"
              value={selectedComponent.props.placeholder || ""}
              onChange={(e) => handlePropsChange("placeholder", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <label
            htmlFor="isRequired-setting"
            className="text-sm font-medium text-gray-700"
          >
            必須項目
          </label>
          <button
            id="isRequired-setting"
            onClick={() =>
              handlePropsChange(
                "isRequired",
                !selectedComponent.props.isRequired
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${
                selectedComponent.props.isRequired
                  ? "bg-blue-600"
                  : "bg-gray-200"
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${
                selectedComponent.props.isRequired
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* --- 選択肢の管理 (特定の部品のみ表示) --- */}
        {["select", "radio", "checkbox"].includes(
          selectedComponent.component_name
        ) && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-semibold">選択肢の管理</h4>
            {(selectedComponent.props.options || []).map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => handleUpdateOption(index, e.target.value)}
                  className="flex-grow border rounded-md p-1"
                />
                <button
                  onClick={() => handleDeleteOption(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={handleAddOption}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              + 選択肢を追加
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
