import { usePathname } from "next/navigation";
import { FaCrown } from "react-icons/fa";

interface SelectedDashboardProps {
  title: string | null;
  isDashboardOwner: boolean;
}

export const SelectedDashboard = ({ title, isDashboardOwner }: SelectedDashboardProps) => {
  const pathname = usePathname();

  if (pathname === "/mypage" || !title) {
    return <div className="hidden text-2xl font-bold text-black03 xl:block">계정관리</div>;
  }

  return (
    <div className="hidden text-2xl font-bold text-black03 xl:block">
      <div className="flex items-center gap-2">
        {title}
        {isDashboardOwner ? <FaCrown fill="#FDD446" className="h-3 w-[15px] xl:h-[14px] xl:w-[18px]" /> : <></>}
      </div>
    </div>
  );
};
