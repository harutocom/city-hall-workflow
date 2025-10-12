// component/features/TextArea.tsx

interface TextAreaProps {
  label: string;
  placeholder: string;
  isRequired: boolean;
}

export default function ({ label, placeholder, isRequired }: TextAreaProps) {
  return (
    <div className="flex flex-col bg-[#F4F6F8] w-[300px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
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
