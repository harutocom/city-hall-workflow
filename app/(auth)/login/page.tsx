// app/(auth)/login/page.tsx
// ログインページのコンポーネント

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/NewButton";
import toast from "react-hot-toast";

export default function Login() {
  // email, password, errorの状態管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // エラーメッセージリセット
    setIsLoading(true);

    // ★トーストで「処理中」を表示
    const loadingToastId = toast.loading("ログイン中...");

    try {
      // signIn関数で認証
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      toast.dismiss(loadingToastId); // ローディングを消す

      // 失敗した場合、エラーメッセージを表示
      if (result?.error) {
        // route.ts で throw したメッセージが入る
        setError(result.error);
        toast.error("メールアドレスまたはパスワードが間違っています");
        setIsLoading(false);
      } else {
        toast.success("ログインしました！");
        // ログイン成功時はhomeへ遷移
        router.push("/home");
        // 遷移するまでローディング中にしておく(連打防止)
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("システムエラーが発生しました");
      setIsLoading(false);
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
              disabled={isLoading} // 処理中は入力不可に
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
              disabled={isLoading} // 処理中は入力不可に
            ></input>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button
            variant="default"
            className="bg-[#CB223F] h-[56px] w-[368px] text-white rounded-[8px]"
            disabled={isLoading}
          >
            {isLoading ? "処理中..." : "ログイン"}
          </Button>
        </form>
      </div>
      <h1></h1>
    </>
  );
}
