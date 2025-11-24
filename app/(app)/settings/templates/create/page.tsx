// app/(app)/settings/templates/create

"use client";

import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"; // 通知ライブラリ
import { useState } from "react";
import { nanoid } from "nanoid";
import { FormComponent, FormComponentType } from "@/types/template";
import TemplateMetadataForm from "@/components/features/templates-bilder/TemplateMetadataForm";
import FormComponentPalette from "@/components/features/templates-bilder/FormComponentPalette";
import FormBuilderCanvas from "@/components/features/templates-bilder/FormBuilderCanvas";
import SettingsPanel from "@/components/features/templates-bilder/SettingsPanel";

export default function TemplateCreatePage() {
  const router = useRouter(); // routerフックを呼び出す

  const [name, setName] = useState<string>(""); // テンプレート名
  const [description, setDescription] = useState<string>(""); // テンプレートの説明
  const [isLoading, setIsLoading] = useState<boolean>(false); // ロード中かどうか(テンプレート作成時)
  const [components, setComponents] = useState<FormComponent[]>([]); // 表示するコンポーネントの配列
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  ); // 選択中のコンポーネントのid

  // selectedIdから選択中のコンポーネントを保持
  const selectedComponent =
    components.find((component) => component.id === selectedComponentId) ||
    null;

  // 実行時 POST api/templatesにデータを送る
  const handleSubmit = async () => {
    // ローディング状態を開始し、ユーザーに通知
    setIsLoading(true);
    toast.loading("テンプレートを作成中...");

    // APIが要求する形式にデータを変換
    const elements = components.map((component, index) => ({
      component_name: component.component_name,
      sort_order: index + 1, // 配列の順番を表示順として利用
      props: component.props,
      data_type: "string", // 必要に応じてdata_typeを決定
    }));

    // 送信するデータ（ペイロード）を作成
    const payload = { name, description, elements };

    try {
      // APIエンドポイントにPOSTリクエストを送信
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.dismiss(); // ローディング通知を消す

      // レスポンスをチェック
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "作成に失敗しました。");
      }

      // 成功時の処理
      toast.success("テンプレートを正常に作成しました！");
      router.push("/settings/templates"); // 一覧ページへ移動
    } catch (error) {
      // 失敗時の処理
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "不明なエラーが発生しました。"
      );
    } finally {
      // 成功・失敗にかかわらず、ローディング状態を解除
      setIsLoading(false);
    }
  };

  // パーツを選択したらcomponents配列に追加 typeのみ受け取り初期値を入れる
  const handleAddComponent = (type: FormComponentType) => {
    const newComponent: FormComponent = {
      id: nanoid(),
      component_name: type,
      props: {
        label: "新しい質問",
        isRequired: false,
      },
    };

    setComponents([...components, newComponent]);
    setSelectedComponentId(newComponent.id);
  };

  // 選択された部品のidをselectedComponentIdにセット
  const handleSelectComponent = (id: string) => {
    setSelectedComponentId(id);
  };

  // 設定パネルでの変更をcomponents配列に反映
  const handleUpdateComponent = (
    id: string,
    newProps: Partial<FormComponent>
  ) => {
    setComponents((currentComponents) =>
      currentComponents.map((component) => {
        if (component.id !== id) {
          return component;
        }
        return { ...component, ...newProps };
      })
    );
  };

  /**
   * 指定されたIDのフォーム部品を配列から削除する（確認なしバージョン）
   * @param id 削除したい部品のID
   */
  const handleDeleteComponent = (id: string) => {
    // filterを使って、IDが一致しない要素だけを残した新しい配列を作る
    setComponents((currentComponents) =>
      currentComponents.filter((component) => component.id !== id)
    );

    // もし削除した部品が現在選択中の部品だったら、選択状態を解除する
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };

  /**
   * 全ての部品の選択を解除する
   */
  const handleDeselect = () => {
    setSelectedComponentId(null);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="p-4 border-b">
        <div className="max-w-4xl mx-auto flex items-start justify-between">
          {/* 左側：先ほど作成したフォームコンポーネント */}
          <div className="flex-grow pr-8">
            <TemplateMetadataForm
              name={name}
              description={description}
              onNameChange={setName}
              onDescriptionChange={setDescription}
            />
          </div>

          {/* 右側：アクションボタン */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              // デザインに合わせたボタンスタイル
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#1F6C7E] text-white font-semibold rounded-md shadow-md hover:bg-[#006666] disabled:bg-gray-400"
            >
              {/* SVGアイコンなどをここに挿入できます */}
              <span>{isLoading ? "作成中..." : "公開する"}</span>
            </button>

            <button
              // onClick={handleSaveDraft} // 下書き保存の関数を別途定義
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-400 text-white font-semibold rounded-md shadow-md hover:bg-gray-500 disabled:opacity-50"
            >
              {/* SVGアイコンなどをここに挿入できます */}
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
    </>
  );
}
