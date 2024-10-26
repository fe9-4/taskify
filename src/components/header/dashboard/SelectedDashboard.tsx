import { Dashboard } from "@/zodSchema/dashboardSchema";

interface SelectedDashboardProps {
  dashboard: Dashboard | null;
}

export const SelectedDashboard = ({ dashboard }: SelectedDashboardProps) => {
  // 대시보드가 없는 경우 처리
  if (!dashboard) {
    return <div>대시보드가 없습니다.</div>;
  }

  return <div>{dashboard.title}</div>;
};
