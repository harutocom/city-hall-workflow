// componets/features/templates-bilder/FormBuilderCanvas.tsx
import { FormComponent } from "@/types/template";

import Check from "../Check";
import DateInput from "../DateInput";
import DateRange from "../DateRange";
import Radio from "../Radio";
import Select from "../Select";
import TextArea from "../TextArea";
import TextEntry from "../TextEntry";

interface FormBuilderCanvasProps {
  components: FormComponent[]; // 表示する部品の配列
  selectedComponentId: string | null; // 現在選択されている部品のID
  onSelectComponent: (id: string) => void; // 部品がクリックされたときに親に通知する関数
}

/**
 * フォーム部品のプレビューを表示する中央のキャンバスエリア
 * @param components - 表示するフォーム部品オブジェクトの配列
 * @param selectedComponentId - 現在選択中の部品ID
 * @param onSelectComponent - 部品がクリックされたときに呼び出すコールバック関数
 */

export default function FormBuilderCanvas({
  components,
  selectedComponentId,
  onSelectComponent,
}: FormBuilderCanvasProps) {
  // 部品の種類に応じて、対応するプレビューコンポーネントを返すヘルパー関数
  const renderComponentPreview = (component: FormComponent) => {
    // DBのpropsカラムに保存されるデータをそのまま各プレビューコンポーネントに渡します
    const props = component.props || {};

    switch (component.component_name) {
      case "text":
        return <TextEntry {...props} />;
      case "textarea":
        return <TextArea {...props} />;
      case "select":
        return <Select {...props} />;
      case "radio":
        return <Radio {...props} />;
      case "checkbox":
        return <Check {...props} />;
      case "date":
        return <DateInput {...props} />;
      case "date_range":
        return <DateRange {...props} />;
      default:
        // 万が一、未対応の部品が来た場合の表示
        return (
          <div className="text-red-500">
            未対応のコンポーネントです: {component.component_name}
          </div>
        );
    }
  };

  return (
    <main className="h-full bg-gray-100 py-[50px] px-[8%] border border-gray-300 rounded-lg shadow-inner overflow-y-auto">
      <div className="bg-white p-[50px]">
        {/* 部品が一つもない場合の表示 */}
        {components.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <p>左のパネルからフォーム部品を追加してください</p>
          </div>
        ) : (
          /* 部品がある場合は、配列をループして表示 */
          <div className="space-y-6">
            {components.map((component) => (
              <div
                key={component.id}
                onClick={() => onSelectComponent(component.id)}
                // 現在選択されている部品かどうかで、枠線のスタイルを動的に変更
                className={`
                    p-1 rounded-lg cursor-pointer transition-all bg-white
                    ${
                      selectedComponentId === component.id
                        ? "ring-2 ring-blue-500 ring-offset-2" // 選択中のスタイル
                        : "hover:ring-2 hover:ring-blue-300" // 通常時のホバースタイル
                    }
                  `}
              >
                {renderComponentPreview(component)}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
