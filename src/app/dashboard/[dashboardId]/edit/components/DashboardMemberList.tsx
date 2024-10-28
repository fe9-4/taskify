import { useDashboardMember } from "@/hooks/useDashboardMember";
import { MemberList } from "@/zodSchema/memberSchema";
import { useEffect, useState } from "react";
import MemberItem from "./MemberItem";

const DashboardMemberList = ({ dashboardId }: { dashboardId: number }) => {
  const [page, setPage] = useState(1);
  const size = 5;
  const { members, isLoading, error, refetch } = useDashboardMember({ dashboardId, page, size });
  const [memberList, setMemberList] = useState<MemberList>({ members: [], totalCount: 0 });

  useEffect(() => {
    if (members) setMemberList(members);
    console.log(dashboardId);
    console.log(members);
  }, [members]);

  if (isLoading) return <div>멤버 정보를 불러오고 있어요</div>;
  if (error) return <div>멤버 정보를 불러오는데 실패했습니다</div>;
  if (!members) return <div>아직 초대된 멤버가 없습니다</div>;
  return (
    <ul>
      <li>
        {memberList.members.map((member) => (
          <MemberItem key={member.id} member={member} />
        ))}
      </li>
    </ul>
  );
};
export default DashboardMemberList;
