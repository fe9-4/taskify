import { cls } from "@/lib/utils";
import { CreateDashboardAtom } from "@/store/modalAtom";
import { useAtom } from "jotai";
import { CiSquarePlus } from "react-icons/ci";

const Button = ({ isExpanded }: { isExpanded: boolean }) => {
  const [, setisCreateDashboardOpen] = useAtom(CreateDashboardAtom);

  return (
    <div className={cls("flex md:justify-between", isExpanded ? "" : "justify-center")}>
      <div
        className={cls(
          "w-full font-semibold text-gray01 md:block md:text-xs md:leading-5",
          isExpanded ? "block" : "hidden"
        )}
      >
        Dash Boards
      </div>
      <button
        type="button"
        onClick={() => setisCreateDashboardOpen(true)}
        className="flex size-[20px] items-center justify-center outline-0 md:justify-end"
      >
        <CiSquarePlus strokeWidth="1" className="size-[20px] text-gray01" />
      </button>
    </div>
  );
};
export default Button;
