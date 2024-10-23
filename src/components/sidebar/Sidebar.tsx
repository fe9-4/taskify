import { DashboardItem, DashboardList } from "./DashboardList";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { ItemType } from "@/types/dashboardType";

export const Sidebar = () => {
  const item1: ItemType = {
    id: 12043,
    title: "여섯글자넘어가면 말줄임표",
    color: "#FFA500",
    userId: 4668,
    createdAt: "2024-10-23T09:38:23.613Z",
    updatedAt: "2024-10-23T09:38:23.613Z",
    createdByMe: true,
  };

  const item2: ItemType = {
    id: 12044,
    title: "다섯글자!!",
    color: "#FFA500",
    userId: 4668,
    createdAt: "2024-10-23T09:38:23.613Z",
    updatedAt: "2024-10-23T09:38:23.613Z",
    createdByMe: false,
  };
  return (
    <aside className="fixed left-0 top-0 z-10 flex h-screen w-[67px] flex-col gap-[39px] border-r border-gray03 bg-white px-[13px] py-5 md:w-[160px] md:gap-[57px] xl:w-[300px] xl:pl-2 xl:pr-3">
      <Logo />
      {/* Dashboard[+] + 대시보드 리스트 */}
      <div className="w-full">
        <Button />
        {/* <DashboardList /> */}
        <DashboardItem key={1} item={item1} />
        <DashboardItem key={2} item={item2} />
      </div>
    </aside>
  );
};
