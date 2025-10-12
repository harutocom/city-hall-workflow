// component/features/DateRange.tsx

interface DateRangeProps {
  label: string;
  isRequired: boolean;
}

export default function DateRange({ label, isRequired }: DateRangeProps) {
  return (
    <div className="flex flex-col bg-[#F4F6F8] w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-[80px]">
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="start-date" className="text-[10px]">
            開始日時
          </label>
          <input
            id="start-date"
            type="date"
            disabled
            className="w-[240px] h-[32px]"
          ></input>
        </div>
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="end-date" className="text-[10px]">
            終了日時
          </label>
          <input
            id="end-date"
            type="date"
            disabled
            className="w-[240px] h-[32px]"
          ></input>
        </div>
      </div>
    </div>
  );
}
