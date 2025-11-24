export default function Button({
  placeholder,
  type,
}: {
  placeholder: string;
  type: "button" | "submit";
}) {
  return (
    <button
      type={type}
      className="bg-[#CB223F] h-[56px] w-[368px] text-white rounded-[8px]"
    >
      {placeholder}
    </button>
  );
}
