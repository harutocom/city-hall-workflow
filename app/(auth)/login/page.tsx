// app/(auth)/login/page.tsx
// ログインページのコンポーネント

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Login() {
  // email, password, errorの状態管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // エラーメッセージリセット

    // signIn関数で認証
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    // 失敗した場合、エラーメッセージを表示
    if (result?.error) {
      // route.ts で throw したメッセージが入る
      setError(result.error);
    } else {
      // ログイン成功時はhomeへ遷移
      router.push("/home");
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-[48px] min-h-screen bg-[#F4F6F8]">
        <Image src="/image 3.png" alt="Logo" width={600} height={232}></Image>
        <h1 className="text-[48px] text-weight font-bold">休暇申請サイト</h1>
        <form
          action=""
          className="flex flex-col justify-center items-center gap-[48px]"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-[16px]">
            <Image src="/mail.svg" alt="mail" width={24} height={24}></Image>
            <input
              type="email"
              placeholder="メールアドレス"
              className="h-[56px] w-[462px] bg-[#D9D9D9] pl-[32px] rounded-[8px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="flex gap-[16px]">
            <Image
              src="/password.svg"
              alt="password"
              width={24}
              height={24}
            ></Image>
            <input
              type="password"
              placeholder="パスワード"
              className="h-[56px] w-[462px] bg-[#D9D9D9] pl-[32px] rounded-[8px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button placeholder="ログイン" type="submit"></Button>
        </form>
      </div>
      <h1></h1>
    </>
  );
}
