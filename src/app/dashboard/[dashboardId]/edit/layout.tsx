import { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드 관리",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default DashboardLayout;
