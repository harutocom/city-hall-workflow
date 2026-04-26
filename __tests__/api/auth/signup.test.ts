import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/nextauth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/db", () => ({
  db: {
    users: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
  },
}));

import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { POST } from "@/app/api/auth/signup/route";

const makeSignupRequest = (body: object) =>
  new NextRequest("http://localhost/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("セッションなしは403を返す", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    const res = await POST(makeSignupRequest({}));
    expect(res.status).toBe(403);
  });

  it("permission_idsにSYSTEM_ADMIN(1)がない場合は403を返す", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { permission_ids: [2, 3] },
      expires: "9999",
    });
    const res = await POST(makeSignupRequest({}));
    expect(res.status).toBe(403);
  });

  it("permission_idsが空配列の場合は403を返す", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { permission_ids: [] },
      expires: "9999",
    });
    const res = await POST(makeSignupRequest({}));
    expect(res.status).toBe(403);
  });

  it("SYSTEM_ADMIN権限あり・必須項目不足は400を返す", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { permission_ids: [1] },
      expires: "9999",
    });
    const res = await POST(makeSignupRequest({ email: "test@example.com" }));
    expect(res.status).toBe(400);
  });

  it("既存ユーザーがいる場合は409を返す", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { permission_ids: [1] },
      expires: "9999",
    });
    vi.mocked(db.users.findUnique).mockResolvedValue({
      id: 1,
      email: "existing@example.com",
    } as any);

    const res = await POST(
      makeSignupRequest({
        email: "existing@example.com",
        name: "山田太郎",
        password: "Password1!",
        departmentId: "1",
        roleId: "1",
        permissionId: "2",
      })
    );
    expect(res.status).toBe(409);
  });
});
