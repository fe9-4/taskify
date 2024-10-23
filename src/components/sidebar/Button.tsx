import { CiSquarePlus } from "react-icons/ci";

export const Button = () => {
  return (
    <div className="mx-auto flex">
      <div className="hidden w-full font-semibold text-gray01 md:block md:text-xs md:leading-5">Dash Boards</div>
      <button className="flex size-[22px] items-center justify-center">
        <CiSquarePlus stroke-width="1" className="size-[14px] text-gray01" />
      </button>
    </div>
  );
};
