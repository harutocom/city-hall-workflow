// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// 部署データ
const departments = [
  { id: 1, name: "DX推進課" },
  { id: 2, name: "総務課" },
];

// 役職データ
const roles = [
  { id: 1, name: "課長" },
  { id: 2, name: "係長" },
  { id: 3, name: "一般" },
];

// 権限データ
const permissions = [
  { id: 1, name: "システム管理者" },
  { id: 2, name: "テンプレート管理" },
  { id: 3, name: "ユーザー管理" },
  { id: 4, name: "全申請閲覧" },
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
  const hashedPassword = await bcrypt.hash("Password123@", 12);

  await prisma.users.upsert({
    where: { email: "admin@example.com" },
    update: {}, // 既に存在する場合は何もしない
    create: {
      email: "admin@example.com",
      name: "admin",
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
      remaining_leave_hours: 155,
    },
  });
  console.log(
    "✅ Admin User created (email: admin@example.com / pass: Password123@)",
  );

  await prisma.users.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "user",
      password_hash: hashedPassword, // Adminと同じハッシュを利用

      // 部署: DX推進課 (id:1)
      departments: {
        connect: { id: 1 },
      },
      // 役職: 一般 (id:3)
      roles: {
        connect: { id: 3 },
      },
      // 権限: 一般ユーザー (id:2)
      user_permissions: {
        create: {
          permissions: {
            connect: { id: 2 },
          },
        },
      },
      remaining_leave_hours: 155,
    },
  });
  console.log(
    "✅ user User created (email: user@example.com / pass: Password123@)",
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
