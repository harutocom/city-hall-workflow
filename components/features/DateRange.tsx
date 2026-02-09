import { ComponentProps } from "@/types/template";

type ExtendedProps = ComponentProps & {
  value?: string | number | boolean;
  disabled?: boolean;
  onChange?: (value: any) => void; // DateRangeは直接値を返す
};

export default function DateRange({
  label,
  isRequired,
  value,
  disabled,
  onChange,
}: ExtendedProps) {
  const [startDate, endDate] = String(value || "").split("~");

  const inputStyle =
    "w-[240px] h-[32px] border border-gray-300 rounded-md px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed";

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const newStart = e.target.value;
    onChange(`${newStart}~${endDate || ""}`);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const newEnd = e.target.value;
    onChange(`${startDate || ""}~${newEnd}`);
  };

  return (
    <div className="flex flex-col w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex gap-[80px]">
        <div className="flex flex-col gap-[8px]">
          <label className="text-[10px] text-gray-600">開始日時</label>
          <input
            type="date"
            value={startDate || ""}
            disabled={disabled}
            readOnly={disabled}
            onChange={handleStartChange}
            className={inputStyle}
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className="text-[10px] text-gray-600">終了日時</label>
          <input
            type="date"
            value={endDate || ""}
            disabled={disabled}
            readOnly={disabled}
            onChange={handleEndChange}
            className={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}
