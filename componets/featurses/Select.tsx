export default function ()
{
  return (
    <div className="flex flex-col bg-[#F4F6F8] w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">選択肢</label>
      <select className="w-[560px] h-[40px] text-[#D9D9D9]">
        <option hidden>選択してください</option>
      </select>
    </div>
  );
}