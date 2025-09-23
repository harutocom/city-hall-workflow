export default function ()
{
  return (
    <div className="flex flex-col bg-[#F4F6F8] w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2">
      <label className="font-bold">ラジオボタン</label>
      <label className="flex gap-[8px]">
        <input type="radio" name="a" value="1"></input>
        <p>選択肢1</p>
      </label>
      <label className="flex gap-[8px]">
        <input type="radio" name="a" value="2"></input>
        <p>選択肢2</p>
      </label>
    </div>
  );
}