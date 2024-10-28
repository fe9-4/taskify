import { useDashboardMember } from "@/hooks/useDashboardMember";
import { useEffect, useState } from "react";
import MemberItem from "./MemberItem";
import axios from "axios";
import toast from "react-hot-toast";
import { Member } from "@/zodSchema/memberSchema";

const DashboardMemberList = ({ dashboardId }: { dashboardId: number }) => {
  const [page, setPage] = useState(1);
  const size = 5;
  const { members, isLoading, error, refetch } = useDashboardMember({ dashboardId, page, size });

  const [memberList, setMemberList] = useState<Member[]>([]);

  const onClickDeleteMember = (id: number, nickname: string) => {
    const deleteMember = async (id: number) => {
      try {
        await axios.delete(`/api/members/${id}`);
        toast.success(`멤버 ${nickname}가 삭제되었습니다`);
        setMemberList(members.members.filter((member) => member.userId !== id));
        refetch();
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

  if (isLoading) return <div>멤버 정보를 불러오고 있어요</div>;
  if (error) return <div>멤버 정보를 불러오는데 실패했습니다</div>;
  if (!members) return <div>아직 초대된 멤버가 없습니다</div>;
  return (
    <ul>
      <li>
        {memberList.map((member) => (
          <MemberItem key={member.id} member={member} onClick={onClickDeleteMember} />
        ))}
      </li>
    </ul>
  );
};
export default DashboardMemberList;
