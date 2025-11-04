// src/mocks/dummy-user-detail.ts

export const DUMMY_USER_DETAIL = {
  name: "山田 次郎",
  email: "yamada.jiro@city-example.jp",
  remaining_leave_hours: "80.0",
  created_at: new Date("2020-04-01T09:00:00Z"),
  updated_at: new Date("2023-10-30T11:00:00Z"),
  roles: {
    id: 2,
    name: "係長",
  },
  departments: {
    id: 20,
    name: "会計課",
  },
  user_permissions: [
    {
      permissions: {
        id: 2,
        name: "一般ユーザー",
      },
    },
  ],
};
