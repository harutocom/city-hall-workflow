import Image from 'next/image';
import Button from '@/componets/ui/Button';

export default function Login() {
  return (
  <>
  <div className='flex flex-col justify-center items-center gap-[48px] mt-[144px]'>
    <Image src="/image 3.png" alt="Logo" width={600} height={232}></Image>
    <h1 className='text-[48px] text-weight font-bold'>休暇申請サイト</h1>
    <form action="" className='flex flex-col justify-center items-center gap-[48px]'>
      <div className='flex gap-[16px]'>
        <Image src="/mail.svg" alt="mail" width={24} height={24}></Image>
        <input type="email" placeholder='メールアドレス' className='h-[56px] w-[462px] bg-[#D9D9D9] pl-[32px] rounded-[8px]'></input>
      </div>
      <div className='flex gap-[16px]'>
        <Image src="/password.svg" alt="password" width={24} height={24}></Image>
        <input type="password" placeholder='パスワード' className='h-[56px] w-[462px] bg-[#D9D9D9] pl-[32px] rounded-[8px]'></input>
      </div>
      <Button placeholder="ログイン"></Button>
    </form>
  </div>
  <h1></h1>
  </>
  );
}
