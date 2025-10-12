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
  type: FormComponentType;
  label: string;
  placeholder?: string;
  required: boolean;
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
export interface OptionsComponentProps {
  label: string;
  placeholder?: string;
  isRequired: boolean;
  options: Option[]; // 上で定義したOptionの配列
}
