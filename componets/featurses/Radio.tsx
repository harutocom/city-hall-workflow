// component/features/Radio.tsx

import { ComponentProps } from "@/types/template";

export default function Radio({
  label,
  placeholder,
  isRequired,
  options,
}: ComponentProps) {
  return (
    <div className="flex flex-col w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      {options &&
        options.map((option) => (
          <label key={option.value} className="flex gap-[8px]">
            <input type="radio" name={label} value={option.value}></input>
            <p>{option.label}</p>
          </label>
        ))}
    </div>
  );
}
