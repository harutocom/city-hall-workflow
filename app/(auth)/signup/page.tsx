import Image from 'next/image';

export default function Signup() {
  return (
  <>
  <div className="flex flex-col mt-[80px] items-center bg-[#F4F6F8]">
    <div className="m-[64px] w-[1312px] h-[816px] rounded-[16px] bg-white">
      <div className="flex w-[1312px] h-[66px] bg-[#1F6C7E] rounded-t-[16px] items-center gap-[16px] pl-[32px] text-[24px] text-white font-bold">
        <p>設定</p>
        <Image src="/arrow-r.svg" alt='arrow' width={28} height={28}></Image>
        <p>ユーザーを追加</p>
      </div>
      <div className='flex flex-col justify-center items-center gap-[40px] pt-[80px] pb-[33px] shadow-lg rounded-[16px]'>
        <input type="name" placeholder='氏名' className='h-[56px] w-[664px] bg-[#D9D9D9] pl-[32px] rounded-[8px]'></input>
        <input type="email" placeholder='メールアドレス' className='h-[56px] w-[664px] bg-[#D9D9D9] pl-[32px] rounded-[8px]'></input>
        <select className='h-[56px] w-[664px] bg-[#D9D9D9] pl-[32px] rounded-[8px]'>
          <option hidden>部署</option>
          <option>DX推進課</option>
          <option>市民課</option>
        </select>
        <select className='h-[56px] w-[664px] bg-[#D9D9D9] pl-[32px] rounded-[8px]'>
          <option hidden>役職</option>
        </select>
        <div className="flex items-center gap-[80px]">
          <h3 className="text-[24px] font-bold">権限</h3>
          <label className="flex">
            <input type="radio" name="auth" value="1"></input>
            <p className="ml-2 text-[24px] font-bold">管理者</p>
          </label>
          <label className="flex">
            <input type="radio" name="auth" value="2"></input>
            <p className="ml-2 text-[24px] font-bold">ユーザー</p>
          </label>
        </div>
        <input type="password" placeholder='初期パスワード' className='h-[56px] w-[664px] bg-[#D9D9D9] pl-[32px] rounded-[8px]'></input>
        <div className="flex gap-[184px] text-white text-[20px] font-bold">
          <div className="flex gap-[8px] w-[240px] h-[80px] bg-[#CB223F] justify-center items-center rounded-[16px]">
            <Image src="/back-arrow.svg" alt="arrow" width={24} height={24}></Image>
            <p>戻る</p>
          </div>
          <div className="flex gap-[8px] w-[240px] h-[80px] bg-[#1F6C7E] justify-center items-center rounded-[16px]">
            <Image src="/plus.svg" alt="plus" width={24} height={24}></Image>
            <p>追加</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
  );
}
