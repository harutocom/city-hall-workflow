"use client";
import ReminingTime from "@/components/features/ReminingTime";
import PreviewTemplate from "@/components/features/GetTemplates";
import { Button } from "@/components/ui/button";

export default function Application() {
  return (
    <>
      <div className="min-h-screen  bg-[#F4F6F8] ">
        <div className="flex flex-col px-38 pt-48 pb-16 ">
          <div className="bg-[#1F6C7E] text-white text-xl font-bold px-6 py-3 rounded-t-xl shadow-black/60">
            新規申請書作成
          </div>
          <div className="flex flex-col p-8 rounded-b-[16px] rounded-t-none shadow-md shadow-black/60 bg-white gap-4">
            <ReminingTime reminingTime={6} />
            <PreviewTemplate templateId="6" />
            <div className="flex justify-end gap-[12px]">
              <Button variant="default">
                <img src="/reset.png" alt="リセット" className="h-4 w-4" />
                リセット
              </Button>
              <Button
                variant="default"
                className="bg-[#746d6d] hover:bg-[#a09a9a]"
              >
                <img src="/download.png" alt="下書き保存" className="h-4 w-4" />
                下書き保存
              </Button>
              <Button
                variant="default"
                className="bg-[#1F6C7E] hover:bg-[#4aa4b9]"
              >
                <img src="/submit.png" alt="送信" className="h-4 w-4" />
                送信
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
