// app/(app)/home/application/[id]/edit

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import RemainingTime from "@/components/features/RemainingTime";
import PreviewTemplate from "@/components/features/applications/PreviewTemplate";
import { Button } from "@/components/ui/NewButton";

export default function ApplicationEditPage() {
  // ★変更1: URLから申請IDを取得
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  // --- State管理 ---
  const [templateId, setTemplateId] = useState<string | null>(null); // ★追加: 取得したデータからテンプレートIDを入れる
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, any>>({}); // { sort_order: 値 }
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true); // 全体のロード中フラグ
  const [templateElements, setTemplateElements] = useState<
    { id: number; sort_order: number }[]
  >([]);

  // --- 1. 初期データのロード (申請データ & 残余時間) ---
  useEffect(() => {
    const init = async () => {
      try {
        // (A) 残余時間の取得
        const timeRes = await fetch("/api/me/remaining-leave");
        if (timeRes.ok) {
          const data = await timeRes.json();
          setRemainingTime(Number(data.remaining_leave_hours));
        }

        // (B) 申請データの取得
        const appRes = await fetch(`/api/applications/${applicationId}`);
        if (!appRes.ok) throw new Error("申請データの取得に失敗しました");
        const appData = await appRes.json();

        // テンプレートIDを保存
        setTemplateId(appData.template_id);
        setTemplateElements(appData.application_templates.template_elements);

        // ★重要: 既存の回答データを answers の形式に変換してセット
        const initialAnswers: Record<number, any> = {};
        appData.application_values.forEach((val: any) => {
          // 型に応じて適切な値を取り出す
          const v =
            val.value_text ??
            val.value_number ??
            val.value_datetime ??
            val.value_boolean;
          // 日付文字列の場合は Date型に直す必要はない（PreviewTemplate側が文字列で受け取るなら）
          // もしDate型が必要なら new Date(v) する
          initialAnswers[val.sort_order] = v;
        });
        setAnswers(initialAnswers);
      } catch (error) {
        console.error("初期化エラー", error);
        toast.error("データの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      init();
    }
  }, [applicationId]);

  // --- 2. 入力値の更新ハンドラ ---
  const handleAnswerChange = (sortOrder: number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [sortOrder]: value,
    }));
  };

  // --- 3. 更新処理 (PUT) ---
  const handleSubmit = async (isDraft: boolean = false) => {
    if (!isDraft && !confirm("変更内容で申請を提出しますか？")) return;

    setSubmitting(true);
    const loadingToastId = toast.loading(isDraft ? "保存中..." : "送信中...");

    try {
      // API形式に変換
      const valuesPayload = Object.entries(answers).map(([key, val]) => {
        const sortOrder = Number(key);

        // 保存しておいたリストから、同じ sort_order の要素を探す
        const element = templateElements.find(
          (el) => el.sort_order === sortOrder
        );

        // もし見つからなかったらエラーにするか、とりあえず進める（基本見つかるはず）
        if (!element) {
          console.error(`Element not found for sort_order: ${sortOrder}`);
        }

        return {
          elementId: element?.id, // ★これが一番大事！
          sort_order: sortOrder,
          value: val,
        };
      });
      const payload = {
        template_id: Number(templateId),
        status: isDraft ? "draft" : "pending", // 下書きならdraft, 申請ならpending
        values: valuesPayload,
      };

      // ★変更2: PUTメソッドで更新
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "更新に失敗しました");
      }

      toast.dismiss(loadingToastId);
      toast.success(
        isDraft ? "下書きを保存しました" : "再申請が完了しました！"
      );

      // 完了後の遷移
      router.push("/home/application");
    } catch (error: any) {
      console.error(error);
      toast.dismiss(loadingToastId);
      toast.error(`エラー: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">読み込み中...</div>;
  if (!templateId)
    return <div className="p-10 text-center">データが見つかりません</div>;

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <Toaster />
      <div className="flex flex-col px-38 pt-48 pb-16 max-w-5xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-[#1F6C7E] text-white text-xl font-bold px-6 py-3 rounded-t-xl shadow-black/60 flex justify-between items-center">
          <span>申請書の編集</span>
          <span className="text-sm font-normal bg-white/20 px-2 py-0.5 rounded">
            編集モード
          </span>
        </div>

        {/* メインコンテンツ */}
        <div className="flex flex-col p-8 rounded-b-[16px] rounded-t-none shadow-md shadow-black/60 bg-white gap-8">
          <RemainingTime reminingTime={remainingTime} />

          {/* テンプレートフォーム (templateIdが必要) */}
          <PreviewTemplate
            templateId={templateId}
            answers={answers}
            onAnswerChange={handleAnswerChange}
          />

          {/* ボタンエリア */}
          <div className="flex justify-end gap-[12px]">
            {/* リセットボタン: 元のデータに戻す機能を実装してもいいが、今回は簡易的に全消し */}
            {/* <Button variant="default" onClick={() => setAnswers({})}>
              <img src="/reset.png" alt="リセット" className="h-4 w-4" />
              リセット
            </Button> 
            */}

            <Button
              variant="default"
              className="bg-[#746d6d] hover:bg-[#a09a9a]"
              onClick={() => handleSubmit(true)} // true = 下書き保存
              disabled={submitting}
            >
              <img src="/download.png" alt="下書き保存" className="h-4 w-4" />
              下書き保存
            </Button>

            <Button
              variant="default"
              className="bg-[#1F6C7E] hover:bg-[#4aa4b9]"
              onClick={() => handleSubmit(false)} // false = 申請
              disabled={submitting}
            >
              <img src="/submit.png" alt="送信" className="h-4 w-4" />
              {submitting ? "送信中..." : "再申請する"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
