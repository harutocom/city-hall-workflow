"use client";
import React, { useState } from "react";

type Notice = {
  id: number;
  type: "approved" | "rejected";
  message: string;
  date: string;
};

export default function Home() {
  const [openId, setOpenId] = useState<number | null>(null);

  const notices: Notice[] = [
    {
      id: 1,
      type: "approved",
      message: "休暇願が承認されました",
      date: "2025/09/19",
    },
    {
      id: 2,
      type: "rejected",
      message: "休暇願が差し戻しされました",
      date: "2025/09/18",
    },
    {
      id: 3,
      type: "approved",
      message: "休暇願が承認されました",
      date: "2025/09/19",
    },
    {
      id: 4,
      type: "approved",
      message: "休暇願が承認されました",
      date: "2025/09/19",
    },
  ];

  return (
    <div className="min-h-screen  bg-[#F4F6F8] ">
      <div className="flex flex-col px-38 pt-48 pb-16 ">
        <div className="bg-[#1F6C7E] text-white text-xl font-bold px-6 py-3 rounded-t-xl shadow-black/60">
          申請履歴
        </div>

        {/* 通知 */}
        <div className="flex flex-col p-8 rounded-b-[16px] rounded-t-none shadow-md shadow-black/60 bg-white gap-4">
          {notices.map((notice) => {
            const isApproved = notice.type === "approved";
            const bgColor = isApproved ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]";
            const borderColor = isApproved ? "border-[#D8FAE4]" : "border-[#F4C2C2]";
            const icon = isApproved ? "/OK.png" : "/NO.png";

            return (
              <div
                key={notice.id}
                className={` flex-col w-full rounded-[12px] border-2 ${borderColor} ${bgColor} p-4`}
              >
                {/* メッセージ・日付・ボタン */}
                <div className="flex items-center justify-between relative">
                  <div className="flex items-center gap-4">
                    <img src={icon} alt="icon" className="w-6 h-6" />
                    <span>{notice.message}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-gray-600">{notice.date}</span>
                    <button
                      className="text-sm text-gray-700 hover:underline"
                      onClick={() =>
                        setOpenId(openId === notice.id ? null : notice.id)
                      }
                    >
                      {openId === notice.id ? "閉じる △" : "詳細 ▽"}
                    </button>
                  </div>
                </div>

                {/* 詳細エリア */}

                {openId === notice.id && (

                  <div className="mt-4 text-sm px-8">
                    <table className={`w-full rounded-md text-sm my-8 ${notice.type === "rejected"? "bg-[#FFCCCD] border border-[#FF6363]": "bg-[#D8FAE4] border border-[#6FB387]"}`}>
                      <tbody>
                        <tr className={`${notice.type === "rejected" ? "border-b border-[#FF6363]" : "border-b border-[#6FB387]"}`}>
                          <td className={`p-2 font-semibold w-24 text-center border ${notice.type === "rejected" ? "border-[#FF6363]" : "border-[#6FB387]"}`}>申請者</td>
                          <td className={`p-2 border ${notice.type === "rejected" ? "border-[#FF6363]" : "border-[#6FB387]"}`}>山田 太郎</td>
                        </tr>
                        <tr className={`${notice.type === "rejected" ? "border-b border-[#FF6363]" : "border-b border-[#6FB387]"}`}>
                          <td className={`p-2 font-semibold w-24 text-center border ${notice.type === "rejected" ? "border-[#FF6363]" : "border-[#6FB387]"}`}>区分</td>
                          <td className={`p-2 border ${notice.type === "rejected" ? "border-[#FF6363]" : "border-[#6FB387]"}`}>年次有給休暇</td>
                        </tr>
                        <tr className={`${notice.type === "rejected" ? "border-b border-[#FF6363]" : "border-b border-[#6FB387]"}`}>
                          <td className={`p-2 font-semibold w-24 text-center border ${notice.type === "rejected" ? "border-[#FF6363]" : "border-[#6FB387]"}`}>処理者</td>
                          <td className={`p-2 border ${notice.type === "rejected" ? "border-[#FF6363]" : "border-[#6FB387]"}`}>課長 → 部長</td>
                        </tr>
                        <tr className={`${notice.type === "rejected" ? "border-b border-[#FF6363]" : "border-b border-[#6FB387]"}`}>
                          <td className={`p-2 font-semibold w-24 text-center border ${notice.type === "rejected" ? "border-[#FF6363]" : "border-[#6FB387]"}`}>コメント</td>
                          <td className={`p-2 border ${notice.type === "rejected" ? "border-[#FF6363]" : "border-[#6FB387]"}`}>{notice.type === "approved"
                              ? "承認されました。"
                              : "理由を確認してください。"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}