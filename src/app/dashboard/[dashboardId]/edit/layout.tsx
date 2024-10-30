import { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드 관리",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen bg-gray05">{children}</div>;
};

export default DashboardLayout;