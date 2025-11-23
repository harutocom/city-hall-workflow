// component/features/TextEntry.tsx

import { ComponentProps } from "@/types/template";

// ★詳細画面用のPropsを追加
type ExtendedProps = ComponentProps & {
  value?: string | number; // APIから来る値
  disabled?: boolean; // 編集不可フラグ
};

export default function TextEntry({
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
      <input
        type="text"
        placeholder={placeholder}
        // ★スタイル調整: 枠線を追加し、disabled時の見た目を設定
        className="w-[560px] h-[40px] border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
        // ★ここが重要！値があればそれを表示する
        value={value !== undefined && value !== null ? String(value) : ""}
        // ★編集不可にする
        disabled={disabled}
        readOnly={disabled}
        onChange={() => {}} // Reactのwarning防止のためのダミー関数
      ></input>
    </div>
  );
}
