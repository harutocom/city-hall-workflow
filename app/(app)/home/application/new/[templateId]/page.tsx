// app/(app)/home/application/new/[templateId]
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// ★ファイル名を修正したもの
import RemainingTime from "@/components/features/RemainingTime";
// ★さっき作った入力対応版のPreviewTemplate
import PreviewTemplate from "@/components/features/applications/PreviewTemplate";
// ★メンバーのボタン(名前変更済み)
import { Button } from "@/components/ui/NewButton";

export default function ApplicationPage() {
  // URLからテンプレートIDを取得
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;

  // --- State管理 ---
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, any>>({}); // { sort_order: 値 }
  const [submitting, setSubmitting] = useState(false);

  // --- 1. 残余時間の取得 ---
  useEffect(() => {
    const fetchRemainingTime = async () => {
      try {
        const res = await fetch("/api/me/remaining-leave");
        if (res.ok) {
          const data = await res.json();
          setRemainingTime(Number(data.remaining_leave_hours));
        }
      } catch (error) {
        console.error("残余時間取得エラー", error);
      }
    };
    fetchRemainingTime();
  }, []);

  // --- 2. 入力値の更新ハンドラ (PreviewTemplateに渡す) ---
  const handleAnswerChange = (sortOrder: number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [sortOrder]: value,
    }));
  };

  // --- 3. 送信処理 ---
  const handleSubmit = async () => {
    if (!confirm("申請を送信しますか？")) return;
    setSubmitting(true);

    try {
      // API形式に変換
      const valuesPayload = Object.entries(answers).map(([key, val]) => ({
        sort_order: Number(key),
        value: val,
      }));

      const payload = {
        template_id: Number(templateId),
        status: "pending", // 申請として送信
        values: valuesPayload,
        approvers: [{ approver_id: 1, step_order: 1 }], // ★MVP用: 課長(ID:1)固定
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "申請に失敗しました");
      }

      alert("申請が完了しました！");
      router.push("/home/approvals"); // 承認一覧へ戻る (または自分の履歴へ)
    } catch (error: any) {
      console.error(error);
      alert(`エラー: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <div className="flex flex-col px-38 pt-48 pb-16 max-w-5xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-[#1F6C7E] text-white text-xl font-bold px-6 py-3 rounded-t-xl shadow-black/60">
          新規申請書作成
        </div>

        {/* メインコンテンツ */}
        <div className="flex flex-col p-8 rounded-b-[16px] rounded-t-none shadow-md shadow-black/60 bg-white gap-8">
          {/* 残余時間 (APIの値を渡す) */}
          <RemainingTime reminingTime={remainingTime} />

          {/* テンプレートフォーム (入力対応版) */}
          {/* templateId, answers, onAnswerChange を渡す */}
          <PreviewTemplate
            templateId={templateId}
            answers={answers}
            onAnswerChange={handleAnswerChange}
          />

          {/* ボタンエリア */}
          <div className="flex justify-end gap-[12px]">
            <Button variant="default" onClick={() => setAnswers({})}>
              <img src="/reset.png" alt="リセット" className="h-4 w-4" />
              リセット
            </Button>

            <Button
              variant="default"
              className="bg-[#746d6d] hover:bg-[#a09a9a]"
              onClick={() => alert("下書き保存は未実装です")}
            >
              <img src="/download.png" alt="下書き保存" className="h-4 w-4" />
              下書き保存
            </Button>

            <Button
              variant="default"
              className="bg-[#1F6C7E] hover:bg-[#4aa4b9]"
              onClick={handleSubmit}
              disabled={submitting}
            >
              <img src="/submit.png" alt="送信" className="h-4 w-4" />
              {submitting ? "送信中..." : "送信"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
