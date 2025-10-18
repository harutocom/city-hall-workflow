// component/features/Slelect.tsx

import { ComponentProps } from "@/types/template";

export default function Select({
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
      <select defaultValue="" className="w-[560px] h-[40px] text-[#D9D9D9]">
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}{" "}
      </select>
    </div>
  );
}
