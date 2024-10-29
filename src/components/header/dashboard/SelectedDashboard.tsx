import { Dashboard } from "@/zodSchema/dashboardSchema";
import { usePathname } from "next/navigation";

interface SelectedDashboardProps {
  title: string | null;
}

export const SelectedDashboard = ({ title }: SelectedDashboardProps) => {
  const pathname = usePathname();

  if (pathname === "/mypage" || !title) {
    return <div className="hidden text-2xl font-bold text-black03 xl:block">계정관리</div>;
  }

  return <div className="hidden text-2xl font-bold text-black03 xl:block">{title}</div>;
};
