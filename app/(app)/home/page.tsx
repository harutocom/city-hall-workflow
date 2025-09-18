import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#F4F6F8]">
      <div className="flex flex-col px-38 pt-48 pb-16 gap-12">
        <button className="h-28 bg-[#1F6C7E] text-white text-4xl font-bold rounded-[16px] shadow-md shadow-black/60">
          <p>申請する</p>
        </button>
        <div className="flex justify-center gap-20">
          <button className="w-140 h-48 bg-[#1F6C7E] text-white text-2xl font-bold  rounded-[16px] shadow-md shadow-black/60 relative">
            <img
              src="/Search.png"
              alt="Search"
              className="absolute top-4 right-4"
            />
            <p className="absolute top-4 left-4">申請中</p>
            <p className="absolute bottom-8 left-8 flex items-end">
              <span className="text-7xl leading-none">2</span>
              <span className="text-3xl ml-1 leading-none">件</span>
            </p>
          </button>
          <button className="w-140 h-48 bg-[#CB223F] text-white text-2xl font-bold  rounded-[16px] shadow-md shadow-black/60 relative">
            <img
              src="/Read.png"
              alt="Read"
              className="absolute top-4 right-4"
            />
            <p className="absolute top-4 left-4">申請待ち</p>
            <p className="absolute bottom-8 left-8 flex items-end">
              <span className="text-7xl leading-none">2</span>
              <span className="text-3xl ml-1 leading-none">件</span>
            </p>
          </button>
          <button className="w-140 h-48 bg-[#1F6C7E] text-white text-2xl font-bold  rounded-[16px] shadow-md shadow-black/60 relative">
            <img
              src="/TimeLimit.png"
              alt="a
              TimeLimit"
              className="absolute top-4 right-4"
            />
            <p className="absolute top-4 left-4">残り時間</p>
            <p className="absolute bottom-8 left-8 flex items-end">
              <span className="text-7xl leading-none">50</span>
              <span className="text-3xl ml-1 leading-none">時間</span>
            </p>
          </button>
        </div>
        <div className="flex p-8 h-96 rounded-[16px] shadow-md shadow-black/60 bg-white">
          <div className="flex flex-col w-full gap-4">
            <p className="font-bold  text-2xl">通知</p>
            <hr className="border-t border-gray-300 my-4" />
            <div className="flex relative w-full h-16 bg-[#F0FDF4] rounded-[12px] border-3 border-[#D8FAE4] ">
              <img src="/OK.png" alt="OK" className="absolute top-3.5 left-4" />
              <p className="absolute top-4.5 left-20">休暇願が承認されました</p>
              <p className="absolute top-4.5 left-80">2025/09/19</p>
            </div>
            <div className="flex relative w-full h-16 bg-[#FEF2F2] rounded-[12px] border-3 border-[#F4C2C2]">
              <img src="/NO.png" alt="NO" className="absolute top-3.5 left-4" />
              <p className="absolute top-4.5 left-20">休暇願が承認されました</p>
              <p className="absolute top-4.5 left-80">2025/09/19</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
