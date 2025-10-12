// component/features/DateInput.tsx

interface DateInputProps {
  label: string;
  isRequired: boolean;
}

export default function DateInput({ label, isRequired }: DateInputProps) {
  return (
    <div className="flex flex-col bg-[#F4F6F8] w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
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
