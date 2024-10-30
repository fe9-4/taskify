import { ItemType } from "@/types/dashboardType";
import DashboardItem from "./DashboardItem";

// 대시보드 리스트 가져오기
const DashboardList = ({ list, isExpanded }: { list: any; isExpanded: boolean }) => {
  let dashboardList = list;
  return (
    <div className="mt-1 md:mt-4">
      {dashboardList.length > 0 ? (
        dashboardList.map((item: ItemType) => <DashboardItem key={item.id} item={item} isExpanded={isExpanded} />)
      ) : (
        <></>
      )}
    </div>
  );
};

export default DashboardList;
