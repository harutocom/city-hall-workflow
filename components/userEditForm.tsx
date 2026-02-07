// /components/userEditForm.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FlattenedUser } from "@/app/(app)/settings/users/[id]/page";
import toast, { Toaster } from "react-hot-toast";

const departments = [
  { id: 1, name: "DX推進課" },
  { id: 2, name: "総務課" },
];

const roles = [
  { id: 1, name: "課長" },
  { id: 2, name: "係長" },
  { id: 3, name: "一般" },
];

export default function UserEditForm({
  initialData,
}: {
  initialData: FlattenedUser;
}) {
  const router = useRouter();
  const params = useParams();

  const [formData, setFormData] = useState<FlattenedUser>(initialData);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    // 1. e.target から「どの項目(name)」が「何(value)」に変更されたかを取り出す
    const { name, value } = e.target;

    // 2. Stateを更新する
    setFormData((prev) => ({
      ...prev, // 既存のデータをすべてコピー（壊さないように）
      [name]: value, // 変更された項目（name）だけを、新しい値（value）で上書き
    }));
  };
  // 3. 更新処理（後ほど Server Action に置き換える部分）
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    toast.loading("ユーザー情報を更新中...");

    try {
      const response = await fetch(`/api/users/${formData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // 一括管理している formData をそのまま送れるので楽ですね！
        body: JSON.stringify(formData),
      });
      toast.dismiss();

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "更新に失敗しました");
        return;
      }
      toast.success("テンプレートを正常に更新しました！");
      router.refresh();
      router.push(`/settings/users`); // 一覧ページに戻る
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "データの読み込みに失敗しました。",
      );
    }
  };
  return (
    <>
      <div className="flex flex-col mt-[80px] items-center bg-[#F4F6F8]">
        <div className="m-[64px] w-[1312px] h-[816px] rounded-[16px] bg-white">
          <div className="flex w-[1312px] h-[66px] bg-[#1F6C7E] rounded-t-[16px] items-center gap-[16px] pl-[32px] text-[24px] text-white font-bold">
            <p>設定</p>
            <Image
              src="/arrow-r.svg"
              alt="arrow"
              width={28}
              height={28}
            ></Image>
            <p>ユーザーを編集</p>
          </div>
          <form
            onSubmit={handleUpdate}
            className="flex flex-col justify-center items-center gap-[40px] pt-[80px] pb-[33px] shadow-lg rounded-[16px]"
          >
            <input
              name="name"
              type="name"
              placeholder="氏名"
              className="h-[56px] w-[664px] bg-[#D9D9D9] pl-[32px] rounded-[8px]"
              value={formData.name}
              onChange={(e) => handleChange(e)}
            ></input>
            <input
              name="email"
              type="email"
              placeholder="メールアドレス"
              className="h-[56px] w-[664px] bg-[#D9D9D9] pl-[32px] rounded-[8px]"
              value={formData.email}
              onChange={(e) => handleChange(e)}
            ></input>
            <select
              name="departmentId"
              className="h-[56px] w-[664px] bg-[#D9D9D9] pl-[32px] rounded-[8px]"
              value={formData.departmentId}
              onChange={(e) => handleChange(e)}
            >
              <option hidden>部署</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <select
              name="roleId"
              className="h-[56px] w-[664px] bg-[#D9D9D9] pl-[32px] rounded-[8px]"
              value={formData.roleId}
              onChange={(e) => handleChange(e)}
            >
              <option hidden>役職</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-[80px]">
              <h3 className="text-[24px] font-bold">権限</h3>
              <label className="flex">
                <input
                  type="radio"
                  name="permissionId"
                  value="1"
                  checked={formData.permissionId === "1"}
                  onChange={(e) => handleChange(e)}
                ></input>
                <p className="ml-2 text-[24px] font-bold">管理者</p>
              </label>
              <label className="flex">
                <input
                  type="radio"
                  name="permissionId"
                  value="2"
                  checked={formData.permissionId === "2"}
                  onChange={(e) => handleChange(e)}
                ></input>
                <p className="ml-2 text-[24px] font-bold">ユーザー</p>
              </label>
            </div>
            <div className="flex gap-[184px] text-white text-[20px] font-bold">
              <div className="flex gap-[8px] w-[240px] h-[80px] bg-[#CB223F] justify-center items-center rounded-[16px]">
                <Image
                  src="/back-arrow.svg"
                  alt="arrow"
                  width={24}
                  height={24}
                ></Image>
                <p>戻る</p>
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <button className="flex gap-[8px] w-[240px] h-[80px] bg-[#1F6C7E] justify-center items-center rounded-[16px]">
                <Image
                  src="/plus.svg"
                  alt="plus"
                  width={24}
                  height={24}
                ></Image>
                <p>追加</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
