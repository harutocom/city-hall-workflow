// src/mocks/dummy-users-list.ts

export const DUMMY_USERS_LIST = [
  {
    id: 1,
    name: "田中 太郎",
    department_id: 10, // ID
    role_id: 1, // ID
    created_at: new Date("2023-04-01T10:00:00Z"),
    updated_at: new Date("2023-11-01T15:30:00Z"),
    user_permissions: [
      {
        permissions: {
          id: 1,
          name: "管理者",
        },
      },
    ],
  },
  {
    id: 2,
    name: "山田 次郎",
    department_id: 20,
    role_id: 2,
    created_at: new Date("2020-04-01T09:00:00Z"),
    updated_at: new Date("2023-10-30T11:00:00Z"),
    user_permissions: [
      {
        permissions: {
          id: 2,
          name: "一般ユーザー",
        },
      },
    ],
  },
  {
    id: 3,
    name: "佐藤 花子",
    department_id: 30,
    role_id: 3,
    created_at: new Date("2022-04-01T09:30:00Z"),
    updated_at: new Date("2023-09-15T14:00:00Z"),
    user_permissions: [
      {
        permissions: {
          id: 2,
          name: "一般ユーザー",
        },
      },
    ],
  },
  {
    id: 4,
    name: "杉山 一平",
    department_id: 10,
    role_id: 4,
    created_at: new Date("2023-04-01T09:00:00Z"),
    updated_at: new Date("2023-04-01T09:00:00Z"),
    user_permissions: [
      {
        permissions: {
          id: 2,
          name: "一般ユーザー",
        },
      },
    ],
  },
];
