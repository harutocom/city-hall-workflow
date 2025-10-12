// component/features/TextArea.tsx

import { ComponentProps } from "@/types/template";

export default function ({
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
      <textarea
        placeholder={placeholder}
        className="w-[240px] h-[40px]"
      ></textarea>
    </div>
  );
}
