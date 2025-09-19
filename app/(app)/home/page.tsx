import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col m-16 gap-16">
      <button className="h-20 bg-[#1F6C7E] text-white font-bold rounded-[16px]">申請する</button>
      <div className="flex justify-center ">
        <button>申請中</button>
        <button>承認待ち</button>
        <button>残り時間</button>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <p className="text-center">通知</p>
        </div>
      </div>
    </div>
  );
}