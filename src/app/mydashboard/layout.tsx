import { Metadata } from "next";

export const metadata: Metadata = {
  title: "내 대시보드",
  openGraph: {
    title: "내 대시보드",
  },
};

const MyDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-gray05">{children}</div>;
};

export default MyDashboardLayout;
