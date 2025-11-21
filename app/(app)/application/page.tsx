"use client";
import ReminingTime from "@/componets/featurses/ReminingTime";
import PreviewTemplate from "@/componets/featurses/PreviewTemplates";
import Button from "@/componets/ui/Button";

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
            <div className="flex">
              <Button placeholder="送信" type="submit" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
