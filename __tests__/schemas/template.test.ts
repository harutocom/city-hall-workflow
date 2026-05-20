import { describe, it, expect } from "vitest";
import { TemplateSchema } from "@/schemas/template";

const validTemplate = {
  name: "休暇申請",
  description: "年次有給休暇の申請フォーム",
  elements: [
    { component_name: "text_input", sort_order: 0, props: { label: "申請理由" } },
  ],
  auto_deduct_leave: false,
};

describe("TemplateSchema", () => {
  it("正常なテンプレートが通る", () => {
    expect(TemplateSchema.safeParse(validTemplate).success).toBe(true);
  });

  it("テンプレート名が空は失敗", () => {
    expect(TemplateSchema.safeParse({ ...validTemplate, name: "" }).success).toBe(false);
  });

  it("elementsが空配列は失敗", () => {
    expect(TemplateSchema.safeParse({ ...validTemplate, elements: [] }).success).toBe(false);
  });

  it("descriptionは省略可能", () => {
    const { description, ...minimal } = validTemplate;
    expect(TemplateSchema.safeParse(minimal).success).toBe(true);
  });

  it("approval_routesは省略可能", () => {
    expect(TemplateSchema.safeParse(validTemplate).success).toBe(true);
  });

  it("approval_routesを指定できる", () => {
    const result = TemplateSchema.safeParse({
      ...validTemplate,
      approval_routes: [{ step_order: 1, approver_user_id: 10 }],
    });
    expect(result.success).toBe(true);
  });

  it("auto_deduct_leaveのデフォルトはfalse", () => {
    const { auto_deduct_leave, ...withoutDeduct } = validTemplate;
    const result = TemplateSchema.parse(withoutDeduct);
    expect(result.auto_deduct_leave).toBe(false);
  });

  it("auto_deduct_leave=trueを指定できる", () => {
    const result = TemplateSchema.safeParse({ ...validTemplate, auto_deduct_leave: true });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.auto_deduct_leave).toBe(true);
  });
});
