// component/features/Slelect.tsx

import { ComponentProps } from "@/types/template";

// ★詳細画面用のPropsを追加
type ExtendedProps = ComponentProps & {
  value?: string | number | boolean;
  disabled?: boolean;
};

export default function Select({
  label,
  placeholder,
  isRequired,
  options,
  // ★これらを受け取る
  value,
  disabled,
}: ExtendedProps) {
  return (
    <div className="flex flex-col w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        // ★ここが重要！値があればそれを選択状態にする
        // (数値やbooleanが来ても文字列に変換して比較できるようにする)
        value={value !== undefined && value !== null ? String(value) : ""}
        // ★編集不可にする
        disabled={disabled}
        onChange={() => {}} // Reactのwarning防止のためのダミー関数
        // ★スタイル調整:
        // - 枠線(border)を追加
        // - 文字色を黒(text-black)に変更 (入力値が見えるように)
        // - disabled時のグレーアウトを追加
        className="w-[560px] h-[40px] border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed text-black"
      >
        {/* 何も選択されていない時の表示 */}
        <option value="" disabled hidden>
          {placeholder || "選択してください"}
        </option>

        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
}
