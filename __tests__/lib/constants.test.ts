import { describe, it, expect } from "vitest";
import {
  ROLES,
  DEPARTMENTS,
  PERMISSIONS,
  getLabel,
  PERMISSION_LABELS,
  ROLE_LABELS,
  DEPARTMENT_LABELS,
} from "@/lib/constants";

describe("ROLES", () => {
  it("3件ある", () => {
    expect(ROLES).toHaveLength(3);
  });

  it("IDが1・2・3の順", () => {
    expect(ROLES.map((r) => r.id)).toEqual([1, 2, 3]);
  });

  it("課長がid=1", () => {
    expect(ROLES.find((r) => r.name === "課長")?.id).toBe(1);
  });

  it("係長がid=2", () => {
    expect(ROLES.find((r) => r.name === "係長")?.id).toBe(2);
  });

  it("一般がid=3", () => {
    expect(ROLES.find((r) => r.name === "一般")?.id).toBe(3);
  });
});

describe("DEPARTMENTS", () => {
  it("2件ある", () => {
    expect(DEPARTMENTS).toHaveLength(2);
  });

  it("DX推進課がid=1", () => {
    expect(DEPARTMENTS.find((d) => d.name === "DX推進課")?.id).toBe(1);
  });

  it("総務課がid=2", () => {
    expect(DEPARTMENTS.find((d) => d.name === "総務課")?.id).toBe(2);
  });
});

describe("PERMISSIONS", () => {
  it("4件ある", () => {
    expect(PERMISSIONS).toHaveLength(4);
  });

  it("システム管理者がid=1（index=0）", () => {
    expect(PERMISSIONS[0]).toEqual({ id: 1, name: "システム管理者" });
  });

  it("テンプレート管理がid=2", () => {
    expect(PERMISSIONS[1]).toEqual({ id: 2, name: "テンプレート管理" });
  });

  it("ユーザー管理がid=3", () => {
    expect(PERMISSIONS[2]).toEqual({ id: 3, name: "ユーザー管理" });
  });

  it("全申請閲覧がid=4", () => {
    expect(PERMISSIONS[3]).toEqual({ id: 4, name: "全申請閲覧" });
  });
});

describe("getLabel", () => {
  it("存在するキーで正しいラベルを返す", () => {
    expect(getLabel("SYSTEM_ADMIN", PERMISSION_LABELS)).toBe("システム管理者");
    expect(getLabel("MANAGER", ROLE_LABELS)).toBe("課長");
    expect(getLabel("DX_PROMOTION", DEPARTMENT_LABELS)).toBe("DX推進課");
  });

  it("存在しないキーはキー自体を返す", () => {
    expect(getLabel("UNKNOWN_KEY", PERMISSION_LABELS)).toBe("UNKNOWN_KEY");
  });
});
