// component/features/Radio.tsx

import { ComponentProps } from "@/types/template";

// ★詳細画面用のPropsを追加
type ExtendedProps = ComponentProps & {
  value?: string | number | boolean;
  disabled?: boolean;
};

export default function Radio({
  label,
  placeholder, // Radioではあまり使わないが型定義にあるので維持
  isRequired,
  options,
  // ★これらを受け取る
  value,
  disabled,
}: ExtendedProps) {
  // ★チェック判定ロジック
  // DBの値(value)と、選択肢の値(optionValue)が一致しているか判定
  const isOptionChecked = (optionValue: string) => {
    if (value === undefined || value === null) return false;
    // 文字列にして比較することで、true(boolean) と "true"(string) の違いを吸収
    return String(value) === String(optionValue);
  };

  return (
    <div className="flex flex-col w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex flex-col gap-2">
        {options &&
          options.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-2 ${
                disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name={label} // グループ化のためにnameは必須
                value={option.value}
                // ★詳細画面用の制御
                disabled={disabled}
                // 詳細画面なら、値が一致するものにチェックを入れる
                // 入力画面なら、Reactの制御外(undefined)にしてユーザー操作に任せる
                checked={disabled ? isOptionChecked(option.value) : undefined}
                // ★スタイル調整
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
      </div>
    </div>
  );
}
