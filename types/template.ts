// types/template.ts

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
  component_name: FormComponentType;
  props: ComponentProps;
}

/**
 * 選択肢一つひとつが持つべきデータの型
 */
export interface Option {
  label: string; // ユーザーに見える表示名
  value: string; // 内部で扱うデータとしての値
}

/**
 * 選択肢を持つコンポーネントが共通して受け取るPropsの型
 */
export interface ComponentProps {
  label: string;
  placeholder?: string;
  isRequired: boolean;
  options?: Option[]; // 上で定義したOptionの配列
}
