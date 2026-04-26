import { describe, it, expect } from "vitest";
import {
  UserCreateSchema,
  UserUpdateSchema,
  UserPasswordChangeSchema,
} from "@/schemas/user";

const validUser = {
  name: "山田太郎",
  email: "yamada@example.com",
  password: "Password1!",
  departmentId: 1,
  roleId: 1,
  permissionIds: [1],
  granted_leave_hours: 155,
  remaining_leave_hours: 155,
};

describe("UserCreateSchema", () => {
  it("正常なユーザーが通る", () => {
    expect(UserCreateSchema.safeParse(validUser).success).toBe(true);
  });

  it("氏名が空は失敗", () => {
    expect(UserCreateSchema.safeParse({ ...validUser, name: "" }).success).toBe(false);
  });

  it("不正なメールアドレスは失敗", () => {
    expect(UserCreateSchema.safeParse({ ...validUser, email: "not-an-email" }).success).toBe(false);
  });

  it("8文字未満のパスワードは失敗", () => {
    expect(UserCreateSchema.safeParse({ ...validUser, password: "P1!a" }).success).toBe(false);
  });

  it("大文字なしのパスワードは失敗", () => {
    expect(UserCreateSchema.safeParse({ ...validUser, password: "password1!" }).success).toBe(false);
  });

  it("小文字なしのパスワードは失敗", () => {
    expect(UserCreateSchema.safeParse({ ...validUser, password: "PASSWORD1!" }).success).toBe(false);
  });

  it("数字なしのパスワードは失敗", () => {
    expect(UserCreateSchema.safeParse({ ...validUser, password: "Password!" }).success).toBe(false);
  });

  it("記号なしのパスワードは失敗", () => {
    expect(UserCreateSchema.safeParse({ ...validUser, password: "Password1" }).success).toBe(false);
  });

  it("オプション項目を省略してもデフォルト値が入る", () => {
    const { granted_leave_hours, remaining_leave_hours, permissionIds, ...minimal } = validUser;
    const result = UserCreateSchema.parse(minimal);
    expect(result.granted_leave_hours).toBe(155);
    expect(result.remaining_leave_hours).toBe(155);
    expect(result.permissionIds).toEqual([]);
  });
});

describe("UserPasswordChangeSchema", () => {
  const validChange = {
    currentPassword: "OldPassword1!",
    newPassword: "NewPassword1!",
    confirmPassword: "NewPassword1!",
  };

  it("正常なパスワード変更が通る", () => {
    expect(UserPasswordChangeSchema.safeParse(validChange).success).toBe(true);
  });

  it("新パスワードが現在のパスワードと同じは失敗", () => {
    const result = UserPasswordChangeSchema.safeParse({
      ...validChange,
      newPassword: "OldPassword1!",
      confirmPassword: "OldPassword1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "newPassword")).toBe(true);
    }
  });

  it("確認パスワードが一致しない場合は失敗", () => {
    const result = UserPasswordChangeSchema.safeParse({
      ...validChange,
      confirmPassword: "DifferentPassword1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "confirmPassword")).toBe(true);
    }
  });

  it("現在のパスワードが空は失敗", () => {
    expect(
      UserPasswordChangeSchema.safeParse({ ...validChange, currentPassword: "" }).success
    ).toBe(false);
  });
});

describe("UserUpdateSchema", () => {
  it("名前だけの部分更新が通る", () => {
    expect(UserUpdateSchema.safeParse({ name: "新しい名前" }).success).toBe(true);
  });

  it("空オブジェクトが通る（全フィールドoptional）", () => {
    expect(UserUpdateSchema.safeParse({}).success).toBe(true);
  });

  it("空文字の名前は失敗", () => {
    expect(UserUpdateSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("不正なメールアドレスは失敗", () => {
    expect(UserUpdateSchema.safeParse({ email: "invalid" }).success).toBe(false);
  });
});
