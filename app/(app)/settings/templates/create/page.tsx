// app/(app)/settings/templates/create

"use client";

import { useState } from "react";
import TemplateMetadataForm from "@/componets/featurses/templates-bilder/TemplateMetadataForm";
import FormComponentPalette from "@/componets/featurses/templates-bilder/FormComponentPalette";
import FormBuilderCanvas from "@/componets/featurses/templates-bilder/FormBuilderCanvas";
import { FormComponent } from "@/types/template";
const sampleComponents: FormComponent[] = [
  {
    id: "id-text-123",
    component_name: "text",
    props: {
      label: "お名前",
      isRequired: true,
      placeholder: "例：鈴木 一郎",
    },
  },
  {
    id: "id-textarea-456",
    component_name: "textarea",
    props: {
      label: "お問い合わせ内容",
      isRequired: true,
      placeholder: "ご自由にご記入ください",
    },
  },
  {
    id: "id-radio-789",
    component_name: "radio",
    props: {
      label: "ご希望の連絡方法",
      isRequired: true,
      options: [
        { label: "メール", value: "email" },
        { label: "電話", value: "phone" },
      ],
    },
  },
  {
    id: "id-checkbox-abc",
    component_name: "checkbox",
    props: {
      label: "興味のある分野（複数選択可）",
      isRequired: false,
      options: [
        { label: "Web開発", value: "web" },
        { label: "データサイエンス", value: "data" },
        { label: "UI/UXデザイン", value: "design" },
      ],
    },
  },
  {
    id: "id-select-def",
    component_name: "select",
    props: {
      label: "所属部署",
      isRequired: true,
      placeholder: "部署を選択してください",
      options: [
        { label: "総務課", value: "soumu" },
        { label: "企画課", value: "kikaku" },
        { label: "健康福祉課", value: "kenkou" },
      ],
    },
  },
  {
    id: "id-date-ghi",
    component_name: "date",
    props: {
      label: "希望日",
      isRequired: false,
    },
  },
  {
    id: "id-daterange-jkl",
    component_name: "date_range",
    props: {
      label: "休暇期間",
      isRequired: true,
    },
  },
];

export default function templateCreatePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [components, setComponents] = useState([]);
  const [selectedComponentId, setSelectedComponentId] = useState("");

  const handleSubmit = () => {};
  const onAddComponent = () => {};
  const onSelectComponent = () => {};

  //   const onNameChange = () => {};
  //   const onDescriptionchange = () => {};
  return (
    <>
      {" "}
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
        <div className="w-[320px]">
          <FormComponentPalette onAddComponent={onAddComponent} />
        </div>
        <div className="w-full">
          <FormBuilderCanvas
            components={sampleComponents}
            selectedComponentId={selectedComponentId}
            onSelectComponent={onSelectComponent}
          />
        </div>
      </div>
    </>
  );
}
