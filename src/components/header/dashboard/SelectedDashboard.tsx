import React from "react";
import { Dashboard } from "@/zodSchema/dashboardSchema";

interface SelectedDashboardProps {
  dashboard: Dashboard | null;
}

export const SelectedDashboard: React.FC<SelectedDashboardProps> = ({ dashboard }) => {
  // dashboards가 undefined이거나 빈 배열인 경우 처리
  if (!dashboard) {
    return <div>대시보드가 없습니다.</div>;
  }

  return <div>{dashboard.title}</div>;
};
