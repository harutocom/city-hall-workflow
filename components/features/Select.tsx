// component/features/Slelect.tsx

import { ComponentProps } from "@/types/template";

<<<<<<< HEAD
=======
type ExtendedProps = ComponentProps & {
  value?: string | number | boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
export default function Select({
  label,
  placeholder,
  isRequired,
  options,
<<<<<<< HEAD
}: ComponentProps) {
=======
  value,
  disabled,
  onChange,
}: ExtendedProps) {
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
  return (
    <div className="flex flex-col w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
<<<<<<< HEAD
      <select defaultValue="" className="w-[560px] h-[40px] text-[#D9D9D9]">
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
=======
      <select
        value={value !== undefined && value !== null ? String(value) : ""}
        disabled={disabled}
        onChange={onChange}
        className="w-[560px] h-[40px] border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed text-black"
      >
        <option value="" disabled hidden>
          {placeholder || "選択してください"}
        </option>
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
<<<<<<< HEAD
          ))}{" "}
=======
          ))}
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
      </select>
    </div>
  );
}
