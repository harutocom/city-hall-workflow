// component/features/DateInput.tsx

import { ComponentProps } from "@/types/template";

// ★詳細画面用のPropsを追加
type ExtendedProps = ComponentProps & {
  value?: string | number | boolean;
  disabled?: boolean;
};

export default function DateInput({
  label,
  placeholder,
  isRequired,
  options,
  // ★これらを受け取る
  value,
  disabled,
}: ExtendedProps) {
  // ★日付フォーマット変換ロジック
  // input type="date" は "YYYY-MM-DD" 形式しか受け付けないため変換する
  const formatDateForInput = (val: any) => {
    if (!val) return "";
    try {
      const date = new Date(String(val));
      if (isNaN(date.getTime())) return "";
      // ISO文字列 (YYYY-MM-DDTHH:mm:ss...) の先頭10文字 (YYYY-MM-DD) を取得
      return date.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="flex flex-col w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="date"
        // ★値を "YYYY-MM-DD" に変換してセット
        value={formatDateForInput(value)}
        // ★編集不可にする (元のコードの disabled 属性だけだと常に無効化されるため修正)
        disabled={disabled}
        readOnly={disabled}
        onChange={() => {}} // warning防止
        // ★スタイル調整: 枠線、角丸、無効化時のスタイルを追加
        className="w-[560px] h-[40px] border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
      />
    </div>
  );
}
