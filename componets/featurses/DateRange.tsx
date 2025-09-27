export default function ()
{
  return (
    <div className="flex flex-col bg-[#F4F6F8] w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">日付範囲選択</label>
      <div className="flex gap-[80px]">
        <div className="flex flex-col gap-[8px]">
          <p className="text-[10px]">開始日時</p>
          <input type="date" placeholder="テキストを入力してください" className="w-[240px] h-[32px]"></input>
        </div>
        <div className="flex flex-col gap-[8px]">
          <p className="text-[10px]">終了日時</p>
          <input type="date" placeholder="テキストを入力してください" className="w-[240px] h-[32px]"></input>
        </div>
      </div>
    </div>
  );
}