import React from "react";

export default function AddUser() {
  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <div className="flex flex-col px-38 pt-32 pb-16">
        {/* カード本体 */}
        <div className="bg-white rounded-[12px] shadow-md shadow-black/40 overflow-hidden w-full max-w-[1200px] mx-auto">

          <div className="bg-[#1F6C7E] text-white text-2xl font-bold px-8 py-4 flex items-center gap-2">
            <span>設定</span>
            <img src="/arrow-r.svg" alt="arrow" className="w-8 h-8"/>
            <span>ユーザーを追加</span>
          </div>

          {/* 本体フォーム */}
          <div className="px-16 py-12 flex flex-col gap-6">
            <input
              type="text"
              placeholder="氏名"
              className="w-full h-12 px-4 rounded-md bg-gray-200 text-gray-700 focus:outline-none"
            />
            <input
              type="email"
              placeholder="メールアドレス"
              className="w-full h-12 px-4 rounded-md bg-gray-200 text-gray-700 focus:outline-none"
            />
            <select className="w-full h-12 px-4 rounded-md bg-gray-200 text-gray-700 focus:outline-none">
              <option>部署</option>
              <option>営業部</option>
              <option>総務部</option>
              <option>開発部</option>
            </select>
            <select className="w-full h-12 px-4 rounded-md bg-gray-200 text-gray-700 focus:outline-none">
              <option>役職</option>
              <option>課長</option>
              <option>係長</option>
              <option>主任</option>
            </select>

            {/* 権限選択*/}
            <div className="flex items-center justify-center gap-20 mt-4 w-full">
              <p className="font-bold text-lg whitespace-nowrap">権限</p>

              <label className="flex items-center gap-2">
                <input type="radio" name="role" defaultChecked />
                <span className="font-bold text-lg">管理者</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="radio" name="role" />
                <span className="font-bold text-lg">一般ユーザー</span>
              </label>
            </div>


            <input
              type="password"
              placeholder="初期パスワード"
              className="w-full h-12 px-4 rounded-md bg-gray-200 text-gray-700 focus:outline-none"
            />

            {/* ボタン */}
            <div className="flex justify-center gap-12 mt-8">
              <button className="w-48 h-14 bg-[#CB223F] text-white font-bold rounded-[12px] shadow-md shadow-black/40 hover:bg-[#e04861] flex justify-center items-center gap-2 text-xl">
                <img src="/back-arrow.svg" alt="back-arrow" className="w-4 h-4"/>
                <span>戻る</span>
              </button>
              <button className="w-48 h-14 bg-[#1F6C7E] text-white font-bold rounded-[12px] shadow-md shadow-black/40 hover:bg-[#21838e] flex justify-center items-center gap-2 text-xl">
                <img src="/Plus.svg" alt="Plus" className="w-4 h-4"/>
                <span>追加</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
