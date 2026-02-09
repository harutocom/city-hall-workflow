// componets/features/templates-bilder/FormBuilderCanvas.tsx
import { FormComponent } from "@/types/template";

// テンプレートのコンポーネントをすべてインポート
import Check from "../Check";
import DateInput from "../DateInput";
import DateRange from "../DateRange";
import DateTimeRange from "../DateTimeRange";
import Radio from "../Radio";
import Select from "../Select";
import TextArea from "../TextArea";
import TextEntry from "../TextEntry";

interface FormBuilderCanvasProps {
  components: FormComponent[]; // 表示する部品の配列
  selectedComponentId: string | null; // 現在選択されている部品のID
  onSelectComponent: (id: string) => void; // 部品がクリックされたときに親に通知する関数
  onDeleteComponent: (id: string) => void;
  onDeselect: () => void;
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
  onDeleteComponent,
  onDeselect,
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
      case "date_time_range":
        return <DateTimeRange {...props} />;
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
    <main
      className="h-full bg-gray-100 py-[50px] px-[8%] border border-gray-300 rounded-lg shadow-inner overflow-y-auto"
      onClick={onDeselect}
    >
      <div className="bg-white p-[50px]" onClick={(e) => e.stopPropagation()}>
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
                onClick={(e) => {
                  e.stopPropagation(); // ここでもイベントを止める
                  onSelectComponent(component.id);
                }}
                // 現在選択されている部品かどうかで、枠線のスタイルを動的に変更
                className={`
                    group relative p-1 rounded-lg cursor-pointer transition-all bg-white
                    ${
                      selectedComponentId === component.id
                        ? "ring-2 ring-blue-500 ring-offset-2" // 選択中のスタイル
                        : "hover:ring-2 hover:ring-blue-300" // 通常時のホバースタイル
                    }
                  `}
              >
                <button
                  onClick={(e) => {
                    // 親要素のonClickイベントが発火しないようにする
                    e.stopPropagation();
                    onDeleteComponent(component.id);
                  }}
                  className={`
                absolute top-0 right-0 z-10 p-1 text-[#F4C2C2] text-3xl rounded-full leading-none transition-opacity
                ${
                  selectedComponentId === component.id
                    ? "text-red-400 opacity-100" // 選択中の場合は常に表示
                    : "opacity-0 group-hover:opacity-100" // それ以外は、親(group)ホバー時のみ表示
                }
              `}
                  style={{ transform: "translate(15%, -30%)" }}
                  aria-label="削除"
                >
                  ×
                </button>
                {renderComponentPreview(component)}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
