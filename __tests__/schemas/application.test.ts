import { describe, it, expect } from "vitest";
import { ApplicationCreateSchema } from "@/schemas/application";

describe("ApplicationCreateSchema", () => {
  const base = {
    template_id: 1,
    status: "draft" as const,
    values: [{ elementId: 1, sort_order: 0, value: "テスト" }],
  };

  it("draft申請が通る", () => {
    expect(ApplicationCreateSchema.safeParse(base).success).toBe(true);
  });

  it("pending申請が通る", () => {
    const result = ApplicationCreateSchema.safeParse({ ...base, status: "pending" });
    expect(result.success).toBe(true);
  });

  it("template_idがない場合は失敗", () => {
    const { template_id, ...rest } = base;
    expect(ApplicationCreateSchema.safeParse(rest).success).toBe(false);
  });

  it("template_id=0は失敗（positiveチェック）", () => {
    expect(ApplicationCreateSchema.safeParse({ ...base, template_id: 0 }).success).toBe(false);
  });

  it("不正なstatusは失敗", () => {
    expect(ApplicationCreateSchema.safeParse({ ...base, status: "approved" }).success).toBe(false);
  });

  it("valuesが空配列は失敗", () => {
    expect(ApplicationCreateSchema.safeParse({ ...base, values: [] }).success).toBe(false);
  });

  it("elementId=0は失敗（positiveチェック）", () => {
    const result = ApplicationCreateSchema.safeParse({
      ...base,
      values: [{ elementId: 0, sort_order: 0, value: "テスト" }],
    });
    expect(result.success).toBe(false);
  });

  it("valueがnullでも通る", () => {
    const result = ApplicationCreateSchema.safeParse({
      ...base,
      values: [{ elementId: 1, sort_order: 0, value: null }],
    });
    expect(result.success).toBe(true);
  });

  it("valueが数値でも通る", () => {
    const result = ApplicationCreateSchema.safeParse({
      ...base,
      values: [{ elementId: 1, sort_order: 0, value: 42 }],
    });
    expect(result.success).toBe(true);
  });

  it("valueがbooleanでも通る", () => {
    const result = ApplicationCreateSchema.safeParse({
      ...base,
      values: [{ elementId: 1, sort_order: 0, value: true }],
    });
    expect(result.success).toBe(true);
  });
});
