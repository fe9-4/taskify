import { Metadata } from "next";

export const metaData: Metadata = {
  title: "대시보드",
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray05">
      {children}
    </div>
  );
}

export default DashboardLayout;