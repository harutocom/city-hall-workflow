// components/features/applications/ApprovalRouteVisualizer.tsx
// 型定義: APIから来るデータ構造に合わせる
type ApprovalStep = {
  id: number;
  step_order: number;
  status: string; // "PENDING", "APPROVED", "REMANDED"
  users: {
    name: string;
  };
};

type Props = {
  steps: ApprovalStep[];
  currentStep: number;
  applicationStatus: string; // "approved", "remanded", "pending", etc.
};

export default function ApprovalRouteVisualizer({
  steps,
  currentStep,
  applicationStatus,
}: Props) {
  // ステップがない場合は何も表示しない
  if (!steps || steps.length === 0) return null;

  return (
    <div className="py-4">
      <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider">
        承認ルート進捗
      </h3>
      <div className="relative pl-2">
        {/* 左側の縦線 (全体をつなぐ線) */}
        <div className="absolute top-2 left-[15px] h-[calc(100%-24px)] w-0.5 bg-gray-200 -z-10"></div>

        <div className="space-y-6">
          {steps.map((step) => {
            // --- 状態判定ロジック ---
            let statusColor = "bg-gray-200 text-gray-400"; // デフォルト: 未来 (未到達)
            let icon = (
              <span className="text-xs font-bold">{step.step_order}</span>
            );
            let labelClass = "text-gray-500";
            let borderClass = "border-gray-200";

            // 1. 完了したステップ (今のステップより前、または 全体承認済み)
            // ※ applicationStatusがapprovedなら、全てのステップを完了扱いにする
            const isCompleted =
              step.step_order < currentStep ||
              (applicationStatus === "approved" && step.status === "APPROVED");

            // 2. 現在進行中のステップ
            const isCurrent =
              step.step_order === currentStep &&
              applicationStatus !== "approved" &&
              applicationStatus !== "remanded";

            // 3. 差し戻し中
            const isRemanded =
              step.step_order === currentStep &&
              applicationStatus === "remanded";

            if (isCompleted) {
              statusColor = "bg-green-500 text-white";
              borderClass = "border-green-500";
              labelClass = "text-gray-900 font-medium";
              icon = (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              );
            } else if (isCurrent) {
              statusColor = "bg-[#1F6C7E] text-white ring-4 ring-[#1F6C7E]/20";
              borderClass = "border-[#1F6C7E]";
              labelClass = "text-[#1F6C7E] font-bold";
              // 点滅アニメーション
              icon = (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              );
            } else if (isRemanded) {
              statusColor = "bg-red-500 text-white";
              borderClass = "border-red-500";
              labelClass = "text-red-600 font-bold";
              icon = (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              );
            }

            return (
              <div key={step.id} className="relative flex items-center gap-4">
                {/* 丸いアイコン部分 */}
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${borderClass} ${statusColor} transition-all duration-300`}
                >
                  {icon}
                </div>
                {/* テキスト部分 */}
                <div className="flex flex-col">
                  <span className={`text-sm ${labelClass}`}>
                    {step.users.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    Step {step.step_order}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
