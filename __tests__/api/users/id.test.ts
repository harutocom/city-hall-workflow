import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    users: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user_permissions: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { GET, DELETE } from "@/app/api/users/[id]/route";

const makeRequest = (id: string, method = "GET") =>
  new NextRequest(`http://localhost/api/users/${id}`, { method });

const adminToken = { id: "1", permission_ids: [1] };
const noPermToken = { id: "5", permission_ids: [2, 3] };

describe("GET /api/users/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("トークンなしは401を返す", async () => {
    vi.mocked(getToken).mockResolvedValue(null);
    const res = await GET(makeRequest("1"), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(401);
  });

  it("SYSTEM_ADMIN権限なしは403を返す", async () => {
    vi.mocked(getToken).mockResolvedValue(noPermToken as any);
    const res = await GET(makeRequest("1"), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(403);
  });

  it("存在するユーザーは200を返す", async () => {
    vi.mocked(getToken).mockResolvedValue(adminToken as any);
    vi.mocked(db.users.findUnique).mockResolvedValue({
      name: "山田太郎",
      email: "yamada@example.com",
      remaining_leave_hours: 100,
      created_at: new Date(),
      updated_at: new Date(),
      roles: { id: 1, name: "課長" },
      departments: { id: 1, name: "DX推進課" },
      user_permissions: [],
    } as any);

    const res = await GET(makeRequest("1"), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(200);
  });

  it("存在しないユーザーは404を返す", async () => {
    vi.mocked(getToken).mockResolvedValue(adminToken as any);
    vi.mocked(db.users.findUnique).mockResolvedValue(null);

    const res = await GET(makeRequest("99"), { params: Promise.resolve({ id: "99" }) });
    expect(res.status).toBe(404);
  });

  it("数値でないIDは400を返す", async () => {
    vi.mocked(getToken).mockResolvedValue(adminToken as any);
    const res = await GET(makeRequest("abc"), { params: Promise.resolve({ id: "abc" }) });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/users/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("トークンなしは401を返す", async () => {
    vi.mocked(getToken).mockResolvedValue(null);
    const res = await DELETE(makeRequest("2", "DELETE"), { params: Promise.resolve({ id: "2" }) });
    expect(res.status).toBe(401);
  });

  it("SYSTEM_ADMIN権限なしは403を返す", async () => {
    vi.mocked(getToken).mockResolvedValue(noPermToken as any);
    const res = await DELETE(makeRequest("2", "DELETE"), { params: Promise.resolve({ id: "2" }) });
    expect(res.status).toBe(403);
  });

  it("自分自身を削除しようとすると400を返す", async () => {
    vi.mocked(getToken).mockResolvedValue(adminToken as any);
    const res = await DELETE(makeRequest("1", "DELETE"), { params: Promise.resolve({ id: "1" }) });
    expect(res.status).toBe(400);
  });

  it("存在しないユーザーは404を返す", async () => {
    vi.mocked(getToken).mockResolvedValue(adminToken as any);
    vi.mocked(db.users.findUnique).mockResolvedValue(null);
    const res = await DELETE(makeRequest("99", "DELETE"), { params: Promise.resolve({ id: "99" }) });
    expect(res.status).toBe(404);
  });

  it("正常に削除できる場合は200を返す", async () => {
    vi.mocked(getToken).mockResolvedValue(adminToken as any);
    vi.mocked(db.users.findUnique).mockResolvedValue({
      id: 2,
      email: "target@example.com",
    } as any);
    vi.mocked(db.users.update).mockResolvedValue({} as any);

    const res = await DELETE(makeRequest("2", "DELETE"), { params: Promise.resolve({ id: "2" }) });
    expect(res.status).toBe(200);
  });
});
