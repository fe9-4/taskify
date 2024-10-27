import React from "react";
import { useDashboardMember } from "@/hooks/useDashboardMember";
import Logo from "@/app/loading";

interface MemberInitialsProps {
  dashboardId: number;
}

// 파스텔 톤 색상 배열 (마지막 색상 제외)
const pastelColors = [
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-indigo-200",
  "bg-red-200",
  "bg-teal-200",
];

export const MemberInitials = ({ dashboardId }: MemberInitialsProps) => {
  const { members, isLoading, error } = useDashboardMember({ dashboardId, page: 1, size: 10 });

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!members) return null;

  const totalMembers = members.members.length;
  const visibleMembersCount = totalMembers <= 5 ? totalMembers : 4;
  const remainingMembersCount = Math.max(0, totalMembers - visibleMembersCount);

  return (
    <ul className="flex list-none flex-row p-0">
      {members.members.slice(0, visibleMembersCount).map((member, index, array) => (
        <li
          key={member.id}
          className={`relative z-${30 - index} -mr-2 flex h-8 w-8 items-center justify-center rounded-full ${
            index === array.length - 1 ? "bg-pink-200" : pastelColors[index % pastelColors.length]
          } text-gray-700 ring-2 ring-white`}
        >
          {member.nickname.charAt(0).toUpperCase()}
        </li>
      ))}
      {remainingMembersCount > 0 && (
        <li
          className={`relative z-${30 - visibleMembersCount} -mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-200 text-gray-700 ring-2 ring-white`}
        >
          +{remainingMembersCount}
        </li>
      )}
    </ul>
  );
};
