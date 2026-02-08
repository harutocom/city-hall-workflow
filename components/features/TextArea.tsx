<<<<<<< HEAD
// component/features/TextArea.tsx

import { ComponentProps } from "@/types/template";

export default function ({
  label,
  placeholder,
  isRequired,
  options,
}: ComponentProps) {
=======
import { ComponentProps } from "@/types/template";

type ExtendedProps = ComponentProps & {
  value?: string | number;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextArea({
  label,
  placeholder,
  isRequired,
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
      <textarea
        placeholder={placeholder}
<<<<<<< HEAD
        className="w-[240px] h-[40px]"
      ></textarea>
=======
        className="w-full h-32 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed resize-none"
        value={value !== undefined && value !== null ? String(value) : ""}
        disabled={disabled}
        readOnly={disabled}
        onChange={onChange}
      />
>>>>>>> 4473c1e1a20e1c93afc5a60dc8769c7f3a60bfd3
    </div>
  );
}
