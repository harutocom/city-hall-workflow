// app/(app)/settings/users/[id]

import Image from "next/image";
import UserEditForm from "@/components/userEditForm";
import { db } from "@/lib/db";
import { permission } from "process";

async function getUser(id: number) {
  const res = await db.users.findUnique({
    where: { id: id },
    select: {
      id: true,
      name: true,
      email: true,
      remaining_leave_hours: true,
      created_at: true,
      updated_at: true,
      roles: {
        select: {
          id: true,
          name: true,
        },
      },
      departments: {
        select: {
          id: true,
          name: true,
        },
      },
      user_permissions: {
        select: {
          permissions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          permissions: {
            id: "asc",
          },
        },
      },
    },
  });
  if (res === null) {
    throw new Error("データの取得に失敗しました。");
  }
  return {
    ...res,
    // Decimal型を number に変換（重要！）
    remaining_leave_hours: res.remaining_leave_hours
      ? Number(res.remaining_leave_hours)
      : 0,

    // Date型も念のため文字列や数値にしておくと安全な場合があります
    created_at: res.created_at.toISOString(),
    updated_at: res.updated_at.toISOString(),
    permissionId: res.user_permissions[0]?.permissions.id.toString() || "2",
    departmentId: res.departments?.id.toString(), // IDを文字列で持っておく
    roleId: res.roles?.id.toString(), // IDを文字列で持っておく
  };
}

export type FlattenedUser = Awaited<ReturnType<typeof getUser>>;

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const userData = await getUser(parseInt(id, 10));

  return (
    <main>
      <UserEditForm initialData={userData}></UserEditForm>
    </main>
  );
}
