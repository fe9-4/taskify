import { useEffect, useState } from "react";
import MemberItem from "./MemberItem";
import axios from "axios";
import toast from "react-hot-toast";
import { Member } from "@/zodSchema/memberSchema";
import { PaginationBtn } from "@/components/button/ButtonComponents";
/* 초대 res
{
  "invitations": [
    {
      "id": 13452,
      "inviter": {
        "id": 4668,
        "email": "yelim@fe.fe",
        "nickname": "yelim"
      },
      "teamId": "9-4",
      "dashboard": {
        "id": 12067,
        "title": "수정테스트"
      },
      "invitee": {
        "id": 4701,
        "email": "cccwon5@naver.com",
        "nickname": "슈퍼펭귄스"
      },
      "inviteAccepted": null,
      "createdAt": "2024-10-26T08:59:15.950Z",
      "updatedAt": "2024-10-26T08:59:15.950Z"
    }
  ],
  "totalCount": 1
}
*/
const InviteList = ({ dashboardId }: { dashboardId: number }) => {
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const size = 5;
  const [inviteList, setInvitateList] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const totalPage: number = Math.ceil(totalCount / size);
  const isFirst = page === 1;
  const isLast = page === totalPage;
  const onClickPrev = () => {
    if (!isFirst) setPage(page - 1);
  };
  const onClickNext = () => {
    if (!isLast) setPage(page + 1);
  };

  const fetchDashboardInvitationList = async () => {
    try {
      const res = await axios.get(`/api/dashboards/${dashboardId}/invitations`);
      const data = res.data;
      setInvitateList(data.user ? data.user.invitations : []);
      setTotalCount(data.totalCount);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.message);
      } else {
        console.error("An unexpected error occurred", err);
      }
    }
  };
  useEffect(() => {
    fetchDashboardInvitationList();
  }, [dashboardId]);

  const onClickDeleteMember = (id: number, nickname: string) => {
    const deleteMember = async (id: number) => {
      try {
        const response = await axios.delete(`/api/members/${id}`);
        if (response.status === 204) {
          toast.success(`멤버 ${nickname}가 삭제되었습니다`);
          // setInvitateList(members.members.filter((member) => member.userId !== id));
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
    const uniqueMembers = inviteList.filter(
      (member, index, self) => index === self.findIndex((m) => m.userId === member.userId)
    );
    if (inviteList.length > 0) {
      setInvitateList(uniqueMembers);
    }
  }, [isLoading]);

  if (isLoading) return <div>멤버 정보를 불러오고 있어요</div>;
  if (error) return <div>멤버 정보를 불러오는데 실패했습니다</div>;
  return (
    <>
      <div className="flex items-center justify-between px-5 py-6 md:px-7 md:py-[26px]">
        <h2 className="col-start-1 text-2xl font-bold md:text-3xl">구성원</h2>
        <div className="flex items-center gap-3 md:gap-4">
          <div>
            {totalPage} 중 {page}
          </div>
          <PaginationBtn
            disabledNext={isFirst && totalPage > size}
            disabledPrev={isLast && totalPage > size}
            onClickPrev={onClickPrev}
            onClickNext={onClickNext}
          />
        </div>
      </div>

      <ul>
        <li>
          {inviteList.map((member) => (
            <MemberItem key={member.id} member={member} onClick={onClickDeleteMember} />
          ))}
        </li>
      </ul>
    </>
  );
};
export default InviteList;
