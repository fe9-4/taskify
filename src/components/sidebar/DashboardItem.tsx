import { cls } from "@/lib/utils";
import { ItemType } from "@/types/dashboardType";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCircle, FaCrown } from "react-icons/fa6";

// 현재 보고있는 대시보드 아이디와 같으면 가장 바깥쪽 div에 보라색 배경
const DashboardItem = ({ item }: { item: any }) => {
  const { color, title, createdByMe, id } = item;

  const pathname = usePathname();
  const isSelected = pathname === `/dashboard/${id}` || pathname === `/dashboard/${id}/edit`;

  let length = 5;
  const shortTitle = title.length > length ? title.slice(0, 5) + "..." : title;

  return (
    <Link
      href={`/dashboard/${item.id}`}
      className={cls(
        "flex h-10 w-10 items-center justify-center rounded-[4px] md:w-full md:py-2 md:pl-[10px] md:pr-0 xl:p-3",
        isSelected ? "bg-violet02" : ""
      )}
      onClick={() => console.log(pathname, isSelected)}
    >
      <div className="flex w-full justify-center md:w-full md:items-center md:justify-start md:gap-4">
        <FaCircle fill={color} width={8} height={8} className="size-2 flex-shrink-0" />
        <div className="flex items-center gap-[6px] md:gap-1">
          <div className="hidden font-medium text-gray01 md:block md:whitespace-nowrap md:text-lg xl:hidden">
            {shortTitle}
          </div>
          <div className="hidden font-medium text-gray01 md:text-lg xl:block xl:text-xl">{title}</div>
          <div className="hidden md:block">
            {createdByMe ? <FaCrown fill="#FDD446" className="h-3 w-[15px] xl:h-[14px] xl:w-[18px]" /> : <></>}
          </div>
        </div>
      </div>
    </Link>
  );
};
export default DashboardItem;
