// 회원이 가입한 대시보드 리스트 [] 받아서 map((listiem)=><DashboardItem />)으로 쭉 나열하기

import { ItemType } from "@/types/dashboardType";
import { FaCircle, FaCrown } from "react-icons/fa6";

// 현재 보고있는 대시보드 아이디와 같으면 가장 바깥쪽 div에 보라색 배경
const DashboardItem = ({ key, item }: { key: number; item: ItemType }) => {
  const { color, title, createdByMe } = item;
  let length = 5;
  let shortTitle;
  if (title.length > length) {
    shortTitle = title.slice(0, 5) + "...";
  }
  return (
    <div key={key} className="flex h-10 w-10 items-center justify-center md:w-full md:py-2 md:pl-[10px] md:pr-0 xl:p-3">
      <div className="flex w-full justify-center md:w-full md:items-center md:justify-start md:gap-4">
        <FaCircle fill={color} width={8} height={8} className="size-2 flex-shrink-0" />
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
export default DashboardItem;
