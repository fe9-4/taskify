import { useDashboardMember } from "@/hooks/useDashboardMember";
import { useState } from "react";
import MemberItem from "./MemberItem";

const DashboardMemberList = ({ dashboardId }: { dashboardId: number }) => {
  const [page, setPage] = useState(1);
  const size = 5;
  const { members, isLoading, error, refetch } = useDashboardMember({ dashboardId, page, size });

  const onClickDeleteMember = (id: number) => {
    console.log(id);
  };

  if (isLoading) return <div>멤버 정보를 불러오고 있어요</div>;
  if (error) return <div>멤버 정보를 불러오는데 실패했습니다</div>;
  if (!members) return <div>아직 초대된 멤버가 없습니다</div>;
  return (
    <ul>
      <li>
        {members.members.map((member) => (
          <MemberItem key={member.id} member={member} onClick={onClickDeleteMember} />
        ))}
      </li>
    </ul>
  );
};
export default DashboardMemberList;
