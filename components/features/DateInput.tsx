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
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="date"
        value={formatDateForInput(value)}
        disabled={disabled}
        readOnly={disabled}
        onChange={onChange}
        className="w-[560px] h-[40px] border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
      />
    </div>
  );
}
