import apiClient from "@/app/api/apiClient";
import config from "@/constants/config";
import { ItemType } from "@/types/dashboardType";
import { useEffect, useState } from "react";
import { FaCrown, FaCircle } from "react-icons/fa";

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

// 회원이 가입한 대시보드 리스트 [] 받아서 map((listiem)=><DashboardItem />)으로 쭉 나열하기
// 현재 보고있는 대시보드 아이디와 같으면 가장 바깥쪽 div에 보라색 배경
export const DashboardItem = ({ key, item }: { key: number; item: ItemType }) => {
  const { color, title, createdByMe } = item;
  let length = 5;
  let shortTitle;
  if (title.length > length) {
    shortTitle = title.slice(0, 5) + "...";
  }
  return (
    <div key={key} className="flex h-10 w-10 items-center justify-center md:w-full md:py-2 md:pl-[10px] md:pr-0 xl:p-3">
      <div className="flex w-full justify-center md:w-full md:items-center md:gap-4">
        <FaCircle fill={color} width={8} height={8} className="size-2" />
        <div className="flex items-center gap-[6px] md:gap-1">
          <div className="hidden whitespace-nowrap font-medium text-gray01 md:block md:text-lg xl:hidden">
            {shortTitle}
          </div>
          <div className="hidden xl:block xl:text-xl">{title}</div>
          <div className="hidden md:block">
            {createdByMe ? <FaCrown fill="#FDD446" className="h-3 w-[15px] xl:h-[14px] xl:w-[18px]" /> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
};

// 대시보드 리스트 가져오기
export const DashboardList = () => {
  const [dashboardList, setDashboardList] = useState<ItemType[]>([]);

  const fetchDashboardList = async () => {
    try {
      const res = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_URL}/${config.TEAM_ID}/dashboards?navigationMethod=pagination&cursorId=1&page=1&size=10`
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
