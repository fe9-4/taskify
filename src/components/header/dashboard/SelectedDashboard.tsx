import React from "react";
import { Dashboard } from "@/zodSchema/dashboardSchema";

interface SelectedDashboardProps {
  selectedDashboardId: number | null;
  dashboards: Dashboard[];
}

export const SelectedDashboard: React.FC<SelectedDashboardProps> = ({ selectedDashboardId, dashboards }) => {
  // 대시보드를 최신순으로 정렬
  const sortedDashboards = dashboards.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // 선택된 대시보드 또는 최신 대시보드
  const displayDashboard = sortedDashboards.find((d) => d.id === selectedDashboardId) || sortedDashboards[0];

  return <div>{displayDashboard.title}</div>;
};
