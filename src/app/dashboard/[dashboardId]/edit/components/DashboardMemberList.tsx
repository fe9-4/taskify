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
    console.log(members);
  }, []);

  return (
    <div>
      {memberList.members.length ? (
        <div>
          {memberList.members.map((member) => (
            <MemberItem key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div>아직 초대된 멤버가 없습니다</div>
      )}
    </div>
  );
};
export default DashboardMemberList;
