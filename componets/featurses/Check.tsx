// component/features/Check.tsx

import { OptionsComponentProps } from "@/types/template";

export default function Check({
  label,
  placeholder,
  isRequired,
  options,
}: OptionsComponentProps) {
  return (
    <div className="flex flex-col bg-[#F4F6F8] w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      {options.map((option) => (
        <label key={option.value} className="flex gap-[8px]">
          <input type="checkbox" name={label} value={option.value}></input>
          <p>{option.label}</p>
        </label>
      ))}
    </div>
  );
}
