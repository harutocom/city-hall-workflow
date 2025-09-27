export default function ()
{
  return (
    <div className="flex flex-col bg-[#F4F6F8] w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">日付選択</label>
      <input type="date" placeholder="テキストを入力してください" className="w-[560px] h-[40px]"></input>
    </div>
  );
}