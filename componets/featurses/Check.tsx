// component/features/Check.tsx

import { ComponentProps } from "@/types/template";

// 型をここで拡張して、詳細画面用のPropsを受け入れられるようにする
type ExtendedProps = ComponentProps & {
  value?: string | number | boolean; // 申請された値
  disabled?: boolean; // 編集不可フラグ
  checked?: boolean; // 単一チェックボックスの場合のフラグ
};

export default function Check({
  label,
  placeholder,
  isRequired,
  options,
  // 承認時用のpropsを追加
  value,
  disabled,
  checked,
}: ExtendedProps) {
  // その選択肢にチェックを入れるべきか判定する関数
  const isOptionChecked = (optionValue: string) => {
    // 値が一致していればチェックを入れる
    if (value === optionValue) return true;
    // もし値が "A,B" みたいにカンマ区切りで来る仕様なら、ここを value.includes(optionValue) に変える
    return false;
  };

  return (
    <div className="flex flex-col w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      {options &&
        options.map((option) => (
          <label key={option.value} className="flex gap-[8px]">
            <input
              type="checkbox"
              name={label}
              value={option.value}
              // 読み取り専用の制御を追加
              disabled={disabled}
              // 答えと一致していればチェックを入れる
              checked={disabled ? isOptionChecked(option.value) : undefined}
              // 編集不可の時の見た目調整
              className="disabled:cursor-not-allowed"
            />
            <p>{option.label}</p>
          </label>
        ))}
    </div>
  );
}
