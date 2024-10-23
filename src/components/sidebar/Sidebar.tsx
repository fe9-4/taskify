import { DashboardList } from "./DashboardList";
import { Logo } from "./Logo";
import { Button } from "./Button";

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-10 flex h-screen w-[67px] flex-col gap-[39px] border-r border-gray03 bg-white px-[22px] py-5 md:w-[160px] md:gap-[57px] md:pr-6 xl:w-[300px] xl:px-6">
      <Logo />
      {/* Dashboard[+] + 대시보드 리스트 */}
      <div className="">
        <Button />
        <DashboardList />
      </div>
    </aside>
  );
};
