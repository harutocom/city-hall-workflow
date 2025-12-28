// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // パスワードハッシュ化に必要

const prisma = new PrismaClient();

// ユーザーから提供された部署データ
const departments = [
  { id: 1, name: "DX推進課" },
  { id: 2, name: "総務課" },
];

// ユーザーから提供された役職データ
const roles = [
  { id: 1, name: "課長" },
  { id: 2, name: "係長" },
  { id: 3, name: "一般" },
];

// 権限データ
const permissions = [
  { id: 1, name: "管理者" },
  { id: 2, name: "ユーザー" },
];

async function main() {
  console.log("🌱 Seeding starting...");

  // 1. 部署 (Departments)
  for (const dept of departments) {
    await prisma.departments.upsert({
      where: { id: dept.id },
      update: { name: dept.name },
      create: { id: dept.id, name: dept.name },
    });
  }
  console.log("✅ Departments seeded");

  // 2. 役職 (Roles)
  for (const role of roles) {
    await prisma.roles.upsert({
      where: { id: role.id },
      update: { name: role.name },
      create: { id: role.id, name: role.name },
    });
  }
  console.log("✅ Roles seeded");

  // 3. 権限 (Permissions)
  for (const perm of permissions) {
    await prisma.permissions.upsert({
      where: { id: perm.id },
      update: { name: perm.name },
      create: { id: perm.id, name: perm.name },
    });
  }
  console.log("✅ Permissions seeded");

  // 4. 初期ユーザー作成 (Admin)
  const hashedPassword = await bcrypt.hash("password123", 12);

  await prisma.users.upsert({
    where: { email: "admin@example.com" },
    update: {}, // 既に存在する場合は何もしない
    create: {
      email: "admin@example.com",
      name: "小林 陽翔",
      password_hash: hashedPassword,

      // 部署: DX推進課 (id:1)
      departments: {
        connect: { id: 1 },
      },
      // 役職: 課長 (id:1)
      roles: {
        connect: { id: 1 },
      },
      // 権限: 管理者権限 (id:1)
      user_permissions: {
        create: {
          permissions: {
            connect: { id: 1 },
          },
        },
      },
      remaining_leave_hours: 80,
    },
  });
  console.log(
    "✅ Admin User created (email: admin@example.com / pass: password123)"
  );

  console.log("🎉 Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
