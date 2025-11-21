import { number } from "zod";

type Props = {
  reminingTime: number;
};
export default function ReminingTime({ reminingTime }: Props) {
  return (
    <>
      <div>
        <button className="w-80 h-48 bg-[#1F6C7E] text-white text-2xl font-bold  rounded-[16px] shadow-md shadow-black/60 relative hover:bg-[#21838e] cursor-pointer">
          <img
            src="/Timelimit.png"
            alt="Search"
            className="absolute top-4 right-4"
          />
          <p className="absolute top-4 left-4">残り時間</p>
          <p className="absolute bottom-8 left-8 flex items-end">
            <span className="text-7xl leading-none">{reminingTime}</span>
            <span className="text-3xl ml-1 leading-none">時間</span>
          </p>
        </button>
      </div>
    </>
  );
}
