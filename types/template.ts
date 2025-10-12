export type FormComponentType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "date_range";

export interface FormComponent {
  id: string;
  type: FormComponentType; // ← ここで早速使う！
  label: string;
  placeholder?: string;
  required: boolean;
}
