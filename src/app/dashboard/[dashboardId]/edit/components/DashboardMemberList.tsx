import { useDashboardMember } from "@/hooks/useDashboardMember";
import { useEffect, useState } from "react";
import MemberItem from "./MemberItem";
import axios from "axios";
import toast from "react-hot-toast";
import { Member } from "@/zodSchema/memberSchema";
import { PaginationBtn } from "@/components/button/ButtonComponents";

const DashboardMemberList = ({ dashboardId }: { dashboardId: number }) => {
  const [page, setPage] = useState(1);
  const size = 4;
  const { members, isLoading, error, refetch } = useDashboardMember({ dashboardId, page, size });

  const [memberList, setMemberList] = useState<Member[]>([]);
  const totalCount = members.totalCount;
  const totalPage: number = Math.ceil(totalCount / size);
  const isFirst = page === 1;
  const isLast = page === totalPage;
  const onClickPrev = () => {
    if (!isFirst) setPage(page - 1);
  };
  const onClickNext = () => {
    if (!isLast) setPage(page + 1);
  };

  // 삭제 요청 시 서버에서 삭제는 되는데 브라우저에서는 500 에러 반환하는 문제 해결해야함
  const onClickDeleteMember = (id: number, nickname: string) => {
    const deleteMember = async (id: number) => {
      try {
        const response = await axios.delete(`/api/members/${id}`);
        if (response.status === 204) {
          toast.success(`멤버 ${nickname}가 삭제되었습니다`);
          setMemberList(members.members.filter((member) => member.userId !== id));
          refetch();
        } else {
          toast.error("삭제하는 중 오류가 발생했습니다.");
        }
      } catch (err) {
        console.error(`Error deleting member: ${id}`, err);
        toast.error("삭제하는 중 오류가 발생했습니다.");
      }
    };
    deleteMember(id);
  };

  useEffect(() => {
    const uniqueMembers = members.members.filter(
      (member, index, self) => index === self.findIndex((m) => m.userId === member.userId)
    );
    if (!isLoading && members && members.members.length > 0) {
      setMemberList(uniqueMembers);
    }
  }, [isLoading]);

  return (
    <>
      <div className="flex items-center justify-between px-5 py-6 md:px-7 md:py-[26px]">
        <h2 className="col-start-1 text-2xl font-bold md:text-3xl">구성원</h2>
        <div className="flex items-center gap-3 md:gap-4">
          <div>
            {totalPage} 중 {page}
          </div>
          <PaginationBtn
            disabledPrev={isFirst && totalPage === 1}
            disabledNext={isLast && totalCount < size}
            onClickPrev={onClickPrev}
            onClickNext={onClickNext}
          />
        </div>
      </div>
      <div className="px-5 md:px-7">
        {isLoading ? <>멤버 정보를 불러오고 있어요</> : <></>}
        {error ? <>멤버 정보를 불러오는데 실패했습니다</> : <></>}
        {!members ? <>아직 초대된 멤버가 없습니다</> : <></>}
      </div>

      <ul>
        <li>
          {memberList.map((member) => (
            <MemberItem key={member.id} member={member} onClick={onClickDeleteMember} />
          ))}
        </li>
      </ul>
    </>
  );
};
export default DashboardMemberList;
