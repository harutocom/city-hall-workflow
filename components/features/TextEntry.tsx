// component/features/TextEntry.tsx

import { ComponentProps } from "@/types/template";

export default function TextEntry({
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
      <input
        type="text"
        placeholder={placeholder}
        className="w-[560px] h-[40px]"
      ></input>
    </div>
  );
}
