// componets/features/templates-bilder/templateMetadataForm.tsx

interface TemplateMetadataFormProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

/**
 * テンプレート名と説明を入力するためのフォームコンポーネント
 * @param name - テンプレート名の値 (親のstate)
 * @param description - テンプレートの説明の値 (親のstate)
 * @param onNameChange - テンプレート名を更新するための関数 (親のsetState)
 * @param onDescriptionChange - テンプレートの説明を更新するための関数 (親のsetState)
 */

export default function TemplateMetadataForm({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: TemplateMetadataFormProps) {
  return (
    <div className="grid gap-6">
      {/* --- テンプレート名入力 --- */}
      <div>
        <label
          htmlFor="template-name"
          // デザインに合わせたラベルのスタイル
          className="inline-block bg-[#1F6C7E] text-white px-4 py-1 text-sm font-semibold rounded-t-md"
        >
          テンプレート名
        </label>
        <input
          id="template-name"
          type="text"
          placeholder="例：休暇願"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          // ラベルの下にくっつくように、上部の角丸はなしにします
          className="block w-full rounded-b-md rounded-r-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
        />
      </div>

      {/* --- テンプレート説明入力 --- */}
      <div>
        <label
          htmlFor="template-description"
          className="inline-block bg-[#1F6C7E] text-white px-4 py-1 text-sm font-semibold rounded-t-md"
        >
          テンプレートの説明
        </label>
        <textarea
          id="template-description"
          placeholder="このテンプレートの用途や注意点を入力してください"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          className="block w-full rounded-b-md rounded-r-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
        />
      </div>
    </div>
  );
}
