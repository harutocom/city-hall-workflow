import React, { useMemo } from "react";
import { ComponentProps } from "@/types/template";

type ExtendedProps = ComponentProps & {
  value?: string | number | boolean;
  disabled?: boolean;
  onChange?: (value: any) => void;
};

// 00:00 ~ 23:45 までの15分刻みの時間リストを生成
const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      options.push(`${hh}:${mm}`);
    }
  }
  return options;
};

export default function DateTimeRange({
  label,
  isRequired,
  value,
  disabled,
  onChange,
}: ExtendedProps) {
  // 時間選択肢の生成（パフォーマンスのためメモ化）
  const timeOptions = useMemo(() => generateTimeOptions(), []);

  // 値のパース処理
  // バックエンドが期待する形式: "YYYY-MM-DD HH:mm~YYYY-MM-DD HH:mm"
  // 空の場合は "" または "~" が来ることを想定
  const [startFull, endFull] = String(value || "").split("~");

  // "YYYY-MM-DD HH:mm" を日付と時間に分解するヘルパー
  const parseDateTime = (val: string) => {
    if (!val) return { date: "", time: "08:30" }; // デフォルト時間の設定（任意）
    const [d, t] = val.split(" ");
    return { date: d || "", time: t || "00:00" };
  };

  const startState = parseDateTime(startFull);
  const endState = parseDateTime(endFull);

  // スタイル定義（既存のデザインを踏襲）
  const baseInputStyle =
    "h-[32px] border border-gray-300 rounded-md px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed";

  // 値更新ハンドラー
  const handleUpdate = (
    position: "start" | "end",
    type: "date" | "time",
    newVal: string,
  ) => {
    if (!onChange) return;

    // 現在の値をコピー
    let newStart = { ...startState };
    let newEnd = { ...endState };

    // 値の更新
    if (position === "start") {
      if (type === "date") newStart.date = newVal;
      if (type === "time") newStart.time = newVal;

      // UX向上: 開始日を入れたら終了日が空なら自動セット（必要なければ削除可）
      if (type === "date" && newVal && !newEnd.date) {
        newEnd.date = newVal;
      }
    } else {
      if (type === "date") newEnd.date = newVal;
      if (type === "time") newEnd.time = newVal;
    }

    // 文字列の再構築 ("YYYY-MM-DD HH:mm" 形式)
    // 日付が選択されている場合のみ、時間を結合する
    const startStr = newStart.date
      ? `${newStart.date} ${newStart.time || "00:00"}`
      : "";
    const endStr = newEnd.date
      ? `${newEnd.date} ${newEnd.time || "00:00"}`
      : "";

    onChange(`${startStr}~${endStr}`);
  };

  return (
    <div className="flex flex-col w-[640px] text-black rounded-[8px] gap-[8px] p-[16px] focus:ring-2 bg-white">
      <label className="font-bold">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex gap-[40px] items-start">
        {/* 開始日時ブロック */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[10px] text-gray-600 font-bold">
            開始日時
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startState.date}
              disabled={disabled}
              onChange={(e) => handleUpdate("start", "date", e.target.value)}
              className={`${baseInputStyle} w-[140px]`}
            />
            <select
              value={startState.time}
              disabled={disabled}
              onChange={(e) => handleUpdate("start", "time", e.target.value)}
              className={`${baseInputStyle} w-[80px]`}
            >
              {timeOptions.map((t) => (
                <option key={`start-${t}`} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-8 text-gray-400">～</div>

        {/* 終了日時ブロック */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[10px] text-gray-600 font-bold">
            終了日時
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={endState.date}
              disabled={disabled}
              onChange={(e) => handleUpdate("end", "date", e.target.value)}
              className={`${baseInputStyle} w-[140px]`}
            />
            <select
              value={endState.time}
              disabled={disabled}
              onChange={(e) => handleUpdate("end", "time", e.target.value)}
              className={`${baseInputStyle} w-[80px]`}
            >
              {timeOptions.map((t) => (
                <option key={`end-${t}`} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
