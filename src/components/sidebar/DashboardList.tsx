import apiClient from "@/app/api/apiClient";
import config from "@/constants/config";
import { ItemType } from "@/types/dashboardType";
import { useEffect, useState } from "react";
import DashboardItem from "./DashboardItem";

/*
https://sp-taskify-api.vercel.app/9-4/dashboards?navigationMethod=pagination&cursorId=1&page=1&size=10

{
  "dashboards": [
    {
      "id": 12043,
      "title": "오렌지 테스트",
      "color": "#FFA500",
      "userId": 4668,
      "createdAt": "2024-10-23T09:38:23.613Z",
      "updatedAt": "2024-10-23T09:38:23.613Z",
      "createdByMe": true
    },
    {
      "id": 12042,
      "title": "테스트",
      "color": "#760DDE",
      "userId": 4668,
      "createdAt": "2024-10-23T09:38:12.639Z",
      "updatedAt": "2024-10-23T09:38:12.639Z",
      "createdByMe": true
    },
    {
      "id": 12041,
      "title": "4팀 중급 프로젝트",
      "color": "#7AC555",
      "userId": 4668,
      "createdAt": "2024-10-23T09:37:32.203Z",
      "updatedAt": "2024-10-23T09:37:32.203Z",
      "createdByMe": true
    }
  ],
  "totalCount": 3,
  "cursorId": null
}
*/

// 대시보드 리스트 가져오기
const DashboardList = () => {
  const [dashboardList, setDashboardList] = useState<ItemType[]>([]);

  const fetchDashboardList = async () => {
    try {
      const res = await apiClient.get(
        `/${config.TEAM_ID}/dashboards?navigationMethod=pagination&cursorId=1&page=1&size=10`
      );
      const dashboards = res.data.dashboards;
      setDashboardList(dashboards);
    } catch (err) {
      console.error(`데이터 fetching error`, err);
    }
  };

  useEffect(() => {
    fetchDashboardList();
  }, []);

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
