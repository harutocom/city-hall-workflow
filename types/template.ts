// types/template.ts
import { z } from "zod";

// Optionのスキーマ
const OptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

// ComponentPropsのスキーマ
const ComponentPropsSchema = z.object({
  label: z.string(),
  isRequired: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(OptionSchema).optional(),
});

// FormComponent全体のスキーマ
const FormComponentSchema = z.object({
  id: z.string(),
  component_name: z.enum([
    "text",
    "textarea",
    "select",
    "radio",
    "checkbox",
    "date",
    "date_range",
    "date_time_range",
  ]),
  props: ComponentPropsSchema,
});

// --- ★★★ ZodスキーマからTypeScriptの型を自動生成 ★★★ ---
// これにより、他のファイルは今まで通り `FormComponent` などをインポートして使えます
export type FormComponent = z.infer<typeof FormComponentSchema>;
export type ComponentProps = z.infer<typeof ComponentPropsSchema>;
export type Option = z.infer<typeof OptionSchema>;

// FormComponentTypeもzodから生成できます
export type FormComponentType = FormComponent["component_name"];
