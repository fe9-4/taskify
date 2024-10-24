import { ItemType } from "@/types/dashboardType";
import { useEffect, useState } from "react";
import DashboardItem from "./DashboardItem";
import { useAuth } from "@/hooks/useAuth";

// 대시보드 리스트 가져오기
const DashboardList = () => {
  const [dashboardList, setDashboardList] = useState<ItemType[]>([]);
  const { user } = useAuth();
  const fetchDashboardList = async () => {
    if (user) {
      try {
        const res = await fetch("/api/dashboard/list", { method: "GET", credentials: "include" });
        if (!res.ok) {
          throw new Error(`Failed to fetch data : ${res.status}`);
        }
        const data = await res.json();

        if (data.dashboards) {
          setDashboardList(data ? data.dashboards : []);
        } else {
          setDashboardList([]);
        }
      } catch (err) {
        console.error(`데이터 fetching error`, err);
      }
    }
  };

  useEffect(() => {
    fetchDashboardList();
  }, [user]);

  return (
    <div>
      {dashboardList.length > 0 ? (
        dashboardList.map((item: ItemType) => <DashboardItem key={item.id} item={item} />)
      ) : (
        <></>
      )}
    </div>
  );
};

export default DashboardList;
