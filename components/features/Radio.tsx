// component/features/Radio.tsx

import { ComponentProps } from "@/types/template";

type ExtendedProps = ComponentProps & {
  value?: string | number | boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Radio({
  label,
  isRequired,
  options,
  value,
  disabled,
  onChange,
}: ExtendedProps) {
  // 値が一致しているか判定する関数
  const isOptionChecked = (optionValue: string) => {
    if (value === undefined || value === null) return false;
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
                name={label}
                value={option.value}
                disabled={disabled}
                // 入力時も表示時も、値が一致していればチェックを入れる
                checked={isOptionChecked(option.value)}
                onChange={onChange}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
      </div>
    </div>
  );
}
