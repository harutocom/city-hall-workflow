import { z } from "zod";

export const TemplateElementSchema = z.object({
  component_name: z.string().min(1),
  sort_order: z.number().int().min(0),
  props: z.record(z.string(), z.any()),
  data_type: z.string().optional(),
});

export const TemplateCreateSchema = z.object({
  name: z.string().min(1, { message: "テンプレート名は必須です。" }),
  description: z.string().nullable().optional(),
  elements: z.array(TemplateElementSchema).min(1),
});
