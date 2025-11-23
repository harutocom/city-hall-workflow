// component/features/TextArea.tsx

import { ComponentProps } from "@/types/template";

// ★詳細画面用に型を拡張 (booleanも受け取れるようにする)
type ExtendedProps = ComponentProps & {
  value?: string | number | boolean;
  disabled?: boolean;
};

export default function TextArea({
  label,
  placeholder,
  isRequired,
  // options, // TextAreaでは使わないので省略
  // ★これらを受け取る
  value,
  disabled,
}: ExtendedProps) {
  return (
    <div className="flex flex-col w-full max-w-[640px] text-black rounded-[8px] gap-2 p-[16px] focus:ring-2">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        placeholder={placeholder}
        // ★スタイル調整: 高さを確保(h-32)し、disabled時の見た目を設定
        className="w-full h-32 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed resize-none"
        // ★ここが修正ポイント！
        // boolean(true/false)が来ても、数値が来ても、必ず文字列に変換して表示する
        value={value !== undefined && value !== null ? String(value) : ""}
        // ★編集不可にする
        disabled={disabled}
        readOnly={disabled}
        onChange={() => {}} // Reactのwarning防止のためのダミー関数
      ></textarea>
    </div>
  );
}
