// component/features/DateInput.tsx

import { ComponentProps } from "@/types/template";

export default function DateInput({
  label,
  placeholder,
  isRequired,
  options,
}: ComponentProps) {
  return (
    <div className="flex flex-col w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label htmlFor="date-input" className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id="date-input"
        type="date"
        disabled
        className="w-[560px] h-[40px]"
      ></input>
    </div>
  );
}
