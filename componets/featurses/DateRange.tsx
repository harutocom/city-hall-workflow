// component/features/DateRange.tsx

import { ComponentProps } from "@/types/template";

// ★詳細画面用のPropsを追加
type ExtendedProps = ComponentProps & {
  value?: string | number | boolean;
  disabled?: boolean;
};

export default function DateRange({
  label,
  placeholder, // DateRangeではあまり使わないが維持
  isRequired,
  options,
  // ★これらを受け取る
  value,
  disabled,
}: ExtendedProps) {
  // ★値を分割するロジック
  // DBに "2025-01-01~2025-01-05" のように入っていると仮定して分割
  const [startDate, endDate] = String(value || "").split("~");

  // 共通のinputスタイル
  const inputStyle =
    "w-[240px] h-[32px] border border-gray-300 rounded-md px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex gap-[80px]">
        {/* 開始日時 */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[10px] text-gray-600">開始日時</label>
          <input
            type="date"
            // ★値をセット
            value={startDate || ""}
            // ★編集不可制御 (元のコードにあった `disabled` 属性だけの記述は削除し、Propsを使用)
            disabled={disabled}
            readOnly={disabled}
            onChange={() => {}}
            className={inputStyle}
          />
        </div>

        {/* 終了日時 */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[10px] text-gray-600">終了日時</label>
          <input
            type="date"
            // ★値をセット
            value={endDate || ""}
            // ★編集不可制御
            disabled={disabled}
            readOnly={disabled}
            onChange={() => {}}
            className={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}
