<<<<<<< HEAD
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
=======
import { ComponentProps } from "@/types/template";

type ExtendedProps = ComponentProps & {
  value?: string | number | boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function DateInput({
  label,
  isRequired,
  value,
  disabled,
  onChange,
}: ExtendedProps) {
  const formatDateForInput = (val: any) => {
    if (!val) return "";
    try {
      const date = new Date(String(val));
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="flex flex-col w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
<<<<<<< HEAD
        id="date-input"
        type="date"
        disabled
        className="w-[560px] h-[40px]"
      ></input>
=======
        type="date"
        value={formatDateForInput(value)}
        disabled={disabled}
        readOnly={disabled}
        onChange={onChange}
        className="w-[560px] h-[40px] border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
      />
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
    </div>
  );
}
