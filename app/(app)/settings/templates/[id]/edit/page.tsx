// app/(app)/settings/templates/[id]/edit.page.tsx
// 作成済みテンプレートを編集する画面
// ほとんどcreate画面と同じで初期値に作成済みテンプレートのデータを入れているだけ

"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { FormComponent, FormComponentType } from "@/types/template";
import TemplateMetadataForm from "@/componets/featurses/templates-bilder/TemplateMetadataForm";
import FormComponentPalette from "@/componets/featurses/templates-bilder/FormComponentPalette";
import FormBuilderCanvas from "@/componets/featurses/templates-bilder/FormBuilderCanvas";
import SettingsPanel from "@/componets/featurses/templates-bilder/SettingsPanel";

// APIから取得するテンプレート詳細データの型
interface TemplateDetail {
  id: number;
  name: string;
  description: string | null;
  template_elements: FormComponent[];
}

/**
 * 作成済みテンプレートを編集する画面
 * @returns - 編集画面
 */
export default function TemplateEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // --- 状態管理 (State) ---
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [components, setComponents] = useState<FormComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );

  // useEffectを使い、レンダリングされたらDBからデータを取得する
  useEffect(() => {
    if (!id) return; // idがなければ何もしない

    /**
     * テンプレートのデータを取得しセットする関数
     * GET /api/templates/${id}を使ってる
     */
    const fetchTemplateData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/templates/${id}`);
        if (!response.ok) {
          throw new Error("テンプレートデータの取得に失敗しました。");
        }
        const data = await response.json();
        const template: TemplateDetail = data.template;

        // 取得したデータでStateを初期化
        setName(template.name);
        setDescription(template.description || "");
        // APIから取得した要素に、クライアント側で使うユニークIDを付与する
        setComponents(
          template.template_elements.map((el) => ({ ...el, id: nanoid() }))
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "データの読み込みに失敗しました。"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateData();
  }, [id]); // idが変わった時に再実行

  // 派生state
  const selectedComponent =
    components.find((component) => component.id === selectedComponentId) ||
    null;

  /**
   * テンプレートの変更内容をDBに反映する関数
   */
  const handleUpdate = async () => {
    setIsLoading(true); // ローディング中に変更
    toast.loading("テンプレートを更新中...");

    const elements = components.map((component, index) => ({
      component_name: component.component_name,
      sort_order: index + 1,
      props: component.props,
      data_type: "string",
    }));

    const payload = { name, description, elements };

    try {
      // 送信先URLとHTTPメソッドをPUTに変更
      const response = await fetch(`/api/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.dismiss();
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "更新に失敗しました。");
      }

      toast.success("テンプレートを正常に更新しました！");
      // 詳細ページに戻る
      router.push(`/settings/templates/${id}`);
      router.refresh();
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "不明なエラーが発生しました。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- 作成画面から流用した関数 ---
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
        component.id === id ? { ...component, ...newProps } : component
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
              onClick={handleUpdate}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#1F6C7E] text-white font-semibold rounded-md shadow-md hover:bg-[#006666] disabled:bg-gray-400"
            >
              <span>{isLoading ? "更新中..." : "更新する"}</span>
            </button>
            <Link href={`/settings/templates/${id}`}>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-gray-400 text-white font-semibold rounded-md shadow-md hover:bg-gray-500 disabled:opacity-50">
                キャンセル
              </button>
            </Link>
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
    </>
  );
}
