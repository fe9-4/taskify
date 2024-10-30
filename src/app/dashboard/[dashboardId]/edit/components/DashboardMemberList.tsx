import { useMember } from "@/hooks/useMember";
import { useState } from "react";
import MemberItem from "./MemberItem";
import Pagination from "@/components/pagination/Pagination";

const DashboardMemberList = ({ dashboardId }: { dashboardId: number }) => {
  const [page, setPage] = useState(1);
  const size = 4;
  const { memberData, isLoading, error, deleteMember, pagination } = useMember({
    dashboardId,
    page,
    size,
  });
  const { totalPages } = pagination;

  return (
    <>
      <div className="flex items-center justify-between px-5 pb-[18px] pt-[22px] md:px-7 md:py-[26px]">
        <h2 className="col-start-1 text-2xl font-bold md:text-3xl">구성원</h2>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="text-xs font-normal md:text-base">
            {totalPages} 중 {page}
          </div>
          <Pagination totalPage={totalPages} setPage={setPage} page={page} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-6 px-5 md:px-7">
        {isLoading && <div className="pb-5 text-gray02">멤버 정보를 불러오고 있어요</div>}
        {error && <div className="pb-5 text-gray02">멤버 정보를 불러오는데 실패했습니다</div>}
      </div>
      {!isLoading && !error && (
        <>
          <div className="px-5 text-base font-normal text-gray02 md:px-7 md:text-lg">이름</div>
          <ul>
            <li>
              {memberData.members.map((member) => (
                <MemberItem key={member.id} member={member} onClick={() => deleteMember(member.id)} />
              ))}
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default DashboardMemberList;
