import { ItemType } from "@/types/dashboardType";
import DashboardItem from "./DashboardItem";

// 대시보드 리스트 가져오기
const DashboardList = ({ list, isExpanded }: { list: ItemType[]; isExpanded: boolean }) => {
  return (
    <div className="mt-1 md:mt-4">
      {list.length > 0 ? (
        list.map((item: ItemType) => <DashboardItem key={item.id} item={item} isExpanded={isExpanded} />)
      ) : (
        <></>
      )}
    </div>
  );
};

export default DashboardList;
