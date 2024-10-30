import React from "react";
import { useMember } from "@/hooks/useMember";

interface MemberInitialsProps {
  dashboardId: number;
}

// 파스텔 톤 색상 배열
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
  // useMember 로 멤버 목록 조회
  const { memberData, isLoading, error } = useMember({
    dashboardId,
    page: 1,
    size: 10,
    showErrorToast: true,
    customErrorMessage: "멤버 목록을 불러오는데 실패했습니다.",
  });

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!memberData.totalCount) return null;

  const totalMembers = memberData.totalCount;

  // 화면 크기별 표시할 멤버 수 설정
  const getVisibleMembersCount = () => {
    return {
      mobile: Math.min(2, totalMembers), // sm, md에서는 최대 2명
      desktop: totalMembers <= 5 ? totalMembers : 4, // xl 이상에서는 최대 4명
    };
  };

  const { mobile: mobileVisibleCount, desktop: desktopVisibleCount } = getVisibleMembersCount();
  const mobileRemainingCount = Math.max(0, totalMembers - mobileVisibleCount);
  const desktopRemainingCount = Math.max(0, totalMembers - desktopVisibleCount);

  return (
    <ul className="flex list-none flex-row p-0">
      {/* 모바일 뷰 (sm, md) */}
      <div className="flex xl:hidden">
        {memberData.members.slice(0, mobileVisibleCount).map((member, index) => (
          <li
            key={member.id}
            className={`relative z-${30 - index} -mr-2 flex h-8 w-8 items-center justify-center rounded-full ${
              pastelColors[index % pastelColors.length]
            } text-gray-700 ring-2 ring-white`}
          >
            {member.nickname.charAt(0).toUpperCase()}
          </li>
        ))}
        {mobileRemainingCount > 0 && (
          <li className="relative z-[28] -mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-200 text-gray-700 ring-2 ring-white">
            +{mobileRemainingCount}
          </li>
        )}
      </div>

      {/* 데스크톱 뷰 (xl 이상) */}
      <div className="hidden xl:flex">
        {memberData.members.slice(0, desktopVisibleCount).map((member, index, array) => (
          <li
            key={member.id}
            className={`relative z-${30 - index} -mr-2 flex h-8 w-8 items-center justify-center rounded-full ${
              pastelColors[index % pastelColors.length]
            } text-gray-700 ring-2 ring-white`}
          >
            {member.nickname.charAt(0).toUpperCase()}
          </li>
        ))}
        {desktopRemainingCount > 0 && (
          <li className="relative z-[28] -mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-pink-200 text-gray-700 ring-2 ring-white">
            +{desktopRemainingCount}
          </li>
        )}
      </div>
    </ul>
  );
};
