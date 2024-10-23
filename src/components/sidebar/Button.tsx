import { CiSquarePlus } from "react-icons/ci";

const Button = () => {
  return (
    <div className="mx-auto flex justify-center">
      <div className="hidden w-full font-semibold text-gray01 md:block md:text-xs md:leading-5">Dash Boards</div>
      <button type="button" className="flex size-[20px] items-center justify-center md:justify-end">
        <CiSquarePlus stroke-width="1" className="size-[20px] text-gray01" />
      </button>
    </div>
  );
};
export default Button;
