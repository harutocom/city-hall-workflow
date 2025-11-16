"use client";

import React, { useState } from "react";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [permissionId, setPermissionId] = useState("2"); // 一般ユーザー ID=2
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    // 入力チェック（仮）
    if (!name || !email || !departmentId || !roleId || !permissionId || !password) {
      alert("全ての必須項目を入力してください");
      return;
    }

    // API に送る形式（キー名と型をAPIに合わせる）
    const payload = {
      name,
      email,
      password,
      department_id: parseInt(departmentId, 10),
      role_id: parseInt(roleId, 10),
      permission_id: parseInt(permissionId, 10),
    };

    console.log("送信データ:", payload);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        alert("エラー: " + text);
        return;
      }

      const result = await response.json();
      console.log("登録成功:", result);
      alert("ユーザー登録が完了しました！");
    } catch (error) {
      console.error("通信エラー:", error);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <div className="flex flex-col px-38 pt-32 pb-16">
        <div className="bg-white rounded-[12px] shadow-md shadow-black/40 overflow-hidden w-full max-w-[1200px] mx-auto">
          <div className="bg-[#1F6C7E] text-white text-2xl font-bold px-8 py-4 flex items-center gap-2">
            <span>設定</span>
            <img src="/arrow-r.svg" alt="arrow" className="w-8 h-8" />
            <span>ユーザーを追加</span>
          </div>

          <div className="px-16 py-12 flex flex-col gap-6">
            {/* 氏名 */}
            <input
              type="text"
              placeholder="氏名"
              className="w-full h-12 px-4 rounded-md bg-gray-200 text-gray-700 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* メール アドレス*/}
            <input
              type="email"
              placeholder="メールアドレス"
              className="w-full h-12 px-4 rounded-md bg-gray-200 text-gray-700 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* 部署（IDに変更） */}
            <select
              className="w-full h-12 px-4 rounded-md bg-gray-200 text-gray-700 focus:outline-none"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">部署</option>
              <option value="10">営業部</option>
              <option value="20">総務部</option>
              <option value="30">開発部</option>
            </select>

            {/* 役職（IDに変更） */}
            <select
              className="w-full h-12 px-4 rounded-md bg-gray-200 text-gray-700 focus:outline-none"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <option value="">役職</option>
              <option value="1">課長</option>
              <option value="2">係長</option>
              <option value="3">主任</option>
            </select>

            {/* 権限（permission_id） */}
            <div className="flex items-center justify-center gap-20 mt-4 w-full">
              <p className="font-bold text-lg whitespace-nowrap">権限</p>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="permission"
                  value="1"
                  checked={permissionId === "1"}
                  onChange={(e) => setPermissionId(e.target.value)}
                />
                <span className="font-bold text-lg">管理者</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="permission"
                  value="2"
                  checked={permissionId === "2"}
                  onChange={(e) => setPermissionId(e.target.value)}
                />
                <span className="font-bold text-lg">一般ユーザー</span>
              </label>
            </div>

            {/* パスワード */}
            <input
              type="password"
              placeholder="初期パスワード"
              className="w-full h-12 px-4 rounded-md bg-gray-200 text-gray-700 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* ボタン */}
            <div className="flex justify-center gap-12 mt-8">
              <button className="w-48 h-14 bg-[#CB223F] text-white font-bold rounded-[12px] shadow-md shadow-black/40 hover:bg-[#e04861] flex justify-center items-center gap-2 text-xl">
                <img src="/back-arrow.svg" alt="back-arrow" className="w-4 h-4" />
                <span>戻る</span>
              </button>

              <button
                onClick={handleSubmit}
                className="w-48 h-14 bg-[#1F6C7E] text-white font-bold rounded-[12px] shadow-md shadow-black/40 hover:bg-[#21838e] flex justify-center items-center gap-2 text-xl"
              >
                <img src="/Plus.svg" alt="Plus" className="w-4 h-4" />
                <span>追加</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
