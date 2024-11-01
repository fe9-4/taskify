import { usePathname } from "next/navigation";
import { FaCrown } from "react-icons/fa";

interface SelectedDashboardProps {
  title: string | null;
  isDashboardOwner: boolean;
}

export const SelectedDashboard = ({ title, isDashboardOwner }: SelectedDashboardProps) => {
  const pathname = usePathname();

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (pathname === "/mypage") {
    return <div className="hidden text-2xl font-bold text-black03 xl:block">계정관리</div>;
  }

  if (pathname === "/mydashboard") {
    return <div className="hidden text-2xl font-bold text-black03 xl:block">내 대시보드</div>;
  }

  if (!title) {
    return null;
  }

  return (
    <div className="hidden text-2xl font-bold text-black03 xl:block">
      <div className="flex items-center gap-1">
        <div className="min-w-0">{truncateText(title, 10)}</div>
        {isDashboardOwner && (
          <div className="flex-shrink-0">
            <FaCrown fill="#FDD446" className="h-3 w-[15px] xl:h-[14px] xl:w-[18px]" />
          </div>
        )}
      </div>
    </div>
  );
};
