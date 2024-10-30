import { useMember } from "@/hooks/useMember";
import { useState } from "react";
import MemberItem from "./MemberItem";
import { PaginationBtn } from "@/components/button/ButtonComponents";

const DashboardMemberList = ({ dashboardId }: { dashboardId: number }) => {
  const [page, setPage] = useState(1);
  const size = 4;

  const { memberData, isLoading, error, deleteMember, pagination } = useMember({
    dashboardId,
    page,
    size,
  });

  const onClickPrev = () => {
    if (!pagination.isFirstPage) setPage(page - 1);
  };

  const onClickNext = () => {
    if (!pagination.isLastPage) setPage(page + 1);
  };

  return (
    <>
      <div className="flex items-center justify-between px-5 py-6 md:px-7 md:py-[26px]">
        <h2 className="col-start-1 text-2xl font-bold md:text-3xl">구성원</h2>
        <div className="flex items-center gap-3 md:gap-4">
          <div>
            {pagination.totalPages} 중 {pagination.currentPage}
          </div>
          <PaginationBtn
            disabledPrev={pagination.isFirstPage}
            disabledNext={pagination.isLastPage}
            onClickPrev={onClickPrev}
            onClickNext={onClickNext}
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 px-5 md:px-7">
        {isLoading && <div className="pb-5">멤버 정보를 불러오고 있어요</div>}
        {error && <div className="pb-5">멤버 정보를 불러오는데 실패했습니다</div>}
      </div>

      <ul>
        <li>
          {memberData.members.map((member) => (
            <MemberItem key={member.id} member={member} onClick={() => deleteMember(member.userId)} />
          ))}
        </li>
      </ul>
    </>
  );
};

export default DashboardMemberList;
