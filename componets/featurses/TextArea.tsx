export default function ()
{
  return (
    <div className="flex flex-col bg-[#F4F6F8] w-[300px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">テキスト入力</label>
      <textarea placeholder="テキストを入力してください" className="w-[240px] h-[40px]"></textarea>
    </div>
  );
}