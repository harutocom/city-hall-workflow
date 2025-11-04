// src/mocks/master-data.ts

/**
 * 部署マスタ (departments)
 * 用途: フォームの<select>の選択肢、一覧でのIDから名前への変換
 */
export const DUMMY_DEPARTMENTS = [
  { id: 10, name: "総務課" },
  { id: 20, name: "会計課" },
  { id: 30, name: "健康福祉課" },
  { id: 40, name: "市民課" },
];

/**
 * 役職マスタ (roles)
 * 用途: フォームの<select>の選択肢、一覧でのIDから名前への変換
 */
export const DUMMY_ROLES = [
  { id: 1, name: "課長" },
  { id: 2, name: "係長" },
  { id: 3, name: "主任" },
  { id: 4, name: "主事" },
];

/**
 * 権限マスタ (permissions)
 * 用途: フォームの<select>の選択肢
 */
export const DUMMY_PERMISSIONS = [
  { id: 1, name: "管理者" },
  { id: 2, name: "一般ユーザー" },
];
