// lib/constants.ts

// --- 権限 (Permissions) ---
export type PermissionKey =
  | "SYSTEM_ADMIN"
  | "MANAGE_TEMPLATES"
  | "MANAGE_USERS"
  | "VIEW_ALL_APPLICATIONS";
export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  SYSTEM_ADMIN: "システム管理者",
  MANAGE_TEMPLATES: "テンプレート管理",
  MANAGE_USERS: "ユーザー管理",
  VIEW_ALL_APPLICATIONS: "全申請閲覧",
};

// --- 役職 (Roles) ---
export type RoleKey = "MANAGER" | "SECTION_HEAD" | "STAFF";
export const ROLE_LABELS: Record<RoleKey, string> = {
  MANAGER: "課長",
  SECTION_HEAD: "係長",
  STAFF: "一般",
};

// --- 部署 (Departments) ---
export type DepartmentKey = "DX_PROMOTION" | "GENERAL_AFFAIRS";
export const DEPARTMENT_LABELS: Record<DepartmentKey, string> = {
  DX_PROMOTION: "DX推進課",
  GENERAL_AFFAIRS: "総務課",
};

// ラベル取得用の共通関数
export function getLabel<T extends string>(
  key: string,
  mapping: Record<T, string>,
): string {
  return mapping[key as T] || key;
}
