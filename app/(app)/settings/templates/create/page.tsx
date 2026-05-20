// app/(app)/settings/templates/create/page.tsx

"use client";

import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react"; // useEffectを追加
import { nanoid } from "nanoid";
import { FormComponent, FormComponentType } from "@/types/template";
import TemplateMetadataForm from "@/components/features/templates-bilder/TemplateMetadataForm";
import FormComponentPalette from "@/components/features/templates-bilder/FormComponentPalette";
import FormBuilderCanvas from "@/components/features/templates-bilder/FormBuilderCanvas";
import SettingsPanel from "@/components/features/templates-bilder/SettingsPanel";

// ユーザーの型定義
type User = {
  id: number;
  name: string;
};

export default function TemplateCreatePage() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [components, setComponents] = useState<FormComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );

  // ★追加 1: 承認ルート設定用のState
  const [users, setUsers] = useState<User[]>([]); // 選択肢となるユーザー一覧
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉
  const [approvalRoutes, setApprovalRoutes] = useState<(string | "")[]>([""]); // 選択された承認者ID (順番 = インデックス)
  const [autoDeductLeave, setAutoDeductLeave] = useState<boolean>(false);

  const handleSaveDraft = () => {
    const draft = { name, description, components, approvalRoutes, autoDeductLeave };
    localStorage.setItem("template_draft", JSON.stringify(draft));
    toast.success("下書きを保存しました");
  };

  const selectedComponent =
    components.find((component) => component.id === selectedComponentId) ||
    null;

  // ★追加 2: マウント時にユーザー一覧を取得
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error("ユーザー取得失敗", error);
        toast.error("ユーザー一覧の取得に失敗しました");
      }
    };
    fetchUsers();
  }, []);

  // ★変更: 「公開する」ボタンが押されたら、まずはモーダルを開く
  const handleOpenModal = () => {
    // 簡易バリデーション
    if (!name) {
      toast.error("テンプレート名を入力してください");
      return;
    }
    if (components.length === 0) {
      toast.error("少なくとも1つの質問項目を追加してください");
      return;
    }
    // 問題なければモーダルを開く
    setIsModalOpen(true);
  };

  // ★変更: モーダルで「作成する」が押された時の最終処理
  const handleFinalSubmit = async () => {
    setIsLoading(true);
    toast.loading("テンプレートを作成中...");

    // 1. フォーム要素のデータ整形
    const elements = components.map((component, index) => ({
      component_name: component.component_name,
      sort_order: index + 1,
      props: component.props,
      data_type: "string",
    }));

    // 2. 承認ルートデータの整形
    // 空文字(未選択)を除外し、数値型に変換してオブジェクト化
    const formattedRoutes = approvalRoutes
      .filter((id) => id !== "")
      .map((userId, index) => ({
        step_order: index + 1,
        approver_user_id: Number(userId),
      }));

    // 3. ペイロード作成
    const payload = {
      name,
      description,
      elements,
      approval_routes: formattedRoutes, // ★ここに追加！
      auto_deduct_leave: autoDeductLeave,
    };

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.dismiss();

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "作成に失敗しました。");
      }

      toast.success("テンプレートと承認ルートを作成しました！");
      router.push("/settings/templates");
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "不明なエラーが発生しました。"
      );
      // エラー時はモーダルを開いたままにするか、閉じるかはお好みで
      // setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComponent = (type: FormComponentType) => {
    const newComponent: FormComponent = {
      id: nanoid(),
      component_name: type,
      props: { label: "新しい質問", isRequired: false },
    };
    setComponents([...components, newComponent]);
    setSelectedComponentId(newComponent.id);
  };

  const handleSelectComponent = (id: string) => {
    setSelectedComponentId(id);
  };

  const handleUpdateComponent = (
    id: string,
    newProps: Partial<FormComponent>
  ) => {
    setComponents((currentComponents) =>
      currentComponents.map((component) =>
        component.id !== id ? component : { ...component, ...newProps }
      )
    );
  };

  const handleDeleteComponent = (id: string) => {
    setComponents((currentComponents) =>
      currentComponents.filter((component) => component.id !== id)
    );
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };

  const handleDeselect = () => {
    setSelectedComponentId(null);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="p-4 border-b">
        <div className="max-w-4xl mx-auto flex items-start justify-between">
          <div className="flex-grow pr-8">
            <TemplateMetadataForm
              name={name}
              description={description}
              onNameChange={setName}
              onDescriptionChange={setDescription}
            />
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleOpenModal} // ★変更: handleSubmit -> handleOpenModal
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#1F6C7E] text-white font-semibold rounded-md shadow-md hover:bg-[#006666] disabled:bg-gray-400"
            >
              <span>{isLoading ? "作成中..." : "公開する"}</span>
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-400 text-white font-semibold rounded-md shadow-md hover:bg-gray-500 disabled:opacity-50"
            >
              <span>下書き保存</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-[25%]">
          <FormComponentPalette onAddComponent={handleAddComponent} />
        </div>
        <div className="w-full">
          <FormBuilderCanvas
            components={components}
            selectedComponentId={selectedComponentId}
            onSelectComponent={handleSelectComponent}
            onDeleteComponent={handleDeleteComponent}
            onDeselect={handleDeselect}
          />
        </div>
        <div className="w-[25%]">
          <SettingsPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={handleUpdateComponent}
            key={selectedComponentId}
          />
        </div>
      </div>

      {/* ★追加: 承認ルート設定モーダル (Tailwind CSS使用) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              承認ルートの設定
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              この申請に必要な承認者を選択してください。
              <br />
              上から順番に承認フローが進みます。
            </p>

            {/* 承認者リスト */}
            <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto">
              {approvalRoutes.map((userId, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold text-sm">
                    {index + 1}
                  </div>

                  <select
                    className="flex-1 border border-gray-300 rounded-md p-2 text-gray-700 focus:ring-2 focus:ring-[#1F6C7E] focus:outline-none"
                    value={userId}
                    onChange={(e) => {
                      const newRoutes = [...approvalRoutes];
                      newRoutes[index] = e.target.value;
                      setApprovalRoutes(newRoutes);
                    }}
                  >
                    <option value="">承認者を選択...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>

                  {/* 削除ボタン */}
                  <button
                    onClick={() => {
                      const newRoutes = approvalRoutes.filter(
                        (_, i) => i !== index
                      );
                      setApprovalRoutes(newRoutes);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="削除"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {approvalRoutes.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">
                  承認者が設定されていません（自動承認になります）
                </p>
              )}
            </div>

            {/* 追加ボタン */}
            <button
              onClick={() => setApprovalRoutes([...approvalRoutes, ""])}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-[#1F6C7E] hover:text-[#1F6C7E] transition-colors mb-6 font-medium"
            >
              + 次の承認者を追加
            </button>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-2">
                オプション設定
              </h3>
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-[#1F6C7E] border-gray-300 rounded focus:ring-[#1F6C7E]"
                  checked={autoDeductLeave}
                  onChange={(e) => setAutoDeductLeave(e.target.checked)}
                />
                <div>
                  <span className="block text-sm font-bold text-gray-800">
                    承認完了時に「有給・残余時間」を自動で減算する
                  </span>
                  <span className="block text-xs text-gray-500 mt-1 leading-relaxed">
                    ※休暇申請など、時間の消費を伴う場合にオンにしてください。
                    <br />
                    ※フォーム内の期間入力をもとに計算されます。
                  </span>
                </div>
              </label>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium"
                disabled={isLoading}
              >
                キャンセル
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-[#1F6C7E] text-white font-bold rounded-md shadow hover:bg-[#006666] disabled:opacity-50"
              >
                {isLoading ? "処理中..." : "決定して作成"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

