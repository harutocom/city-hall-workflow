// app/(app)/settings/users
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type Permission = {
  id: number;
  name: string;
};

export interface Users {
  id: number;
  name: string;
  department_id: number;
  departments: { name: string };
  role_id: number;
  roles: { name: string };
  permission_id: number;
  created_at: string;
  updated_at: string;
  user_permissions: {
    permissions: {
      name: string;
    };
  }[];
}

export default function TemplateListPage() {
  const router = useRouter();

  // --- 状態管理 ---
  const [users, setUsers] = useState<Users[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラーメッセージ

  // --- データ取得ロジック ---
  useEffect(() => {
    // ページが読み込まれた時にAPIからデータを取得する
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("データの取得に失敗しました。");
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "不明なエラーが発生しました。",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []); // 空の配列を渡すことで、コンポーネントのマウント時に一度だけ実行される

  // --- レンダリング ---

  // ローディング中の表示
  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  // エラー発生時の表示
  if (error) {
    return <div className="p-8 text-center text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold border-l-4 border-[#008080] pl-4">
          ユーザー一覧
        </h1>
        <Link href="/signup">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#008080] text-white font-semibold rounded-lg shadow-md hover:bg-[#006666] transition-colors">
            {/* ここにアイコンを挿入できます (例: <PencilIcon />) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>新規作成</span>
          </button>
        </Link>
      </header>

      {/* テンプレート一覧テーブル */}
      <div className="shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-[#008080] text-white">
            <tr>
              <th className="py-3 px-6 text-left">氏名</th>
              <th className="py-3 px-6 text-left">部署</th>
              <th className="py-3 px-6 text-left">役割</th>
              <th className="py-3 px-6 text-left">権限</th>
              <th className="py-3 px-6 text-left"> </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">{user.name}</td>
                <td className="py-4 px-6">{user.departments.name}</td>
                <td className="py-4 px-6">{user.roles.name}</td>
                <td className="py-4 px-6">
                  {user.user_permissions[0].permissions.name}
                </td>
                <td className="py-4 px-6 text-sm">
                  <button
                    className="text-blue-500 hover:underline font-bold cursor-pointer"
                    onClick={() => router.push(`/settings/users/${user.id}`)}
                  >
                    編集
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            ユーザーがまだ作成されていません。
          </div>
        )}
      </div>
    </div>
  );
}
