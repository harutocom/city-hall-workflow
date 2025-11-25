// component/features/Check.tsx

import { ComponentProps } from "@/types/template";

type ExtendedProps = ComponentProps & {
  value?: string | number | boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Check({
  label,
  isRequired,
  options,
  value,
  disabled,
  onChange,
}: ExtendedProps) {
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

      {options &&
        options.map((option) => (
          <label key={option.value} className="flex gap-[8px]">
            <input
              type="checkbox"
              name={label}
              value={option.value}
              disabled={disabled}
              checked={isOptionChecked(option.value)}
              onChange={onChange}
              className="disabled:cursor-not-allowed"
            />
            <p>{option.label}</p>
          </label>
        ))}
    </div>
  );
}
