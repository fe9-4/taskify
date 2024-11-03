import React from "react";
import { SelectedDashboard } from "./SelectedDashboard";
import { MemberInitials } from "./MemberInitials";
import { useDashboard } from "@/hooks/useDashboard";
import { useMember } from "@/hooks/useMember";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useToggleModal } from "@/hooks/useModal";

export const DashboardMemberDisplay = () => {
  const router = useRouter();
  const params = useParams();
  const toggleModal = useToggleModal();
  const currentDashboardId = params?.dashboardId ? Number(params.dashboardId) : null;

  // 대시보드 정보 조회
  const { dashboardInfo, isLoading: isDashboardInfoLoading } = useDashboard({
    dashboardId: currentDashboardId || 0,
  });

  // 멤버 목록 조회 - 대시보드 정보가 있을 때만
  const { memberData, isLoading: isMemberLoading } = useMember({
    dashboardId: currentDashboardId || 0,
    page: 1,
    size: 100,
    enabled: !!dashboardInfo,
  });

  // 대시보드 ID가 없는 경우 렌더링하지 않음
  if (!currentDashboardId) return null;
  if (isDashboardInfoLoading || isMemberLoading) return null;

  // 실제 표시할 대시보드 정보
  const displayDashboard = dashboardInfo;

  // 대시보드 소유자 여부 확인
  const isDashboardOwner = displayDashboard?.createdByMe || false;

  // 초대하기 버튼 클릭 핸들러
  const handleInviteClick = () => {
    toggleModal("invitationDashboard", true);
  };

  // 관리 버튼 클릭 핸들러
  const handleSettingClick = () => {
    router.push(`/dashboard/${currentDashboardId}/edit`);
  };

  return (
    <div className="flex h-full w-full items-center justify-between">
      {/* 대시보드 제목 영역 */}
      <div className="w-[100px] pl-1 md:w-[240px]">
        <SelectedDashboard title={displayDashboard?.title || ""} isDashboardOwner={isDashboardOwner} />
      </div>

      {/* 대시보드 관리 버튼 영역 */}
      <div className="flex items-center text-base text-gray01 md:text-lg">
        {isDashboardOwner && (
          <>
            {/* 관리 버튼 */}
            <div
              onClick={handleSettingClick}
              className="flex h-[30px] w-[49px] cursor-pointer items-center justify-center gap-1 rounded-lg border border-gray03 md:h-[36px] md:w-[85px]"
            >
              <Image
                src="/images/header/setting.svg"
                alt="관리"
                width={20}
                height={20}
                className="hidden md:inline-block"
              />
              <span className="text-center">관리</span>
            </div>
            {/* 초대하기 버튼 */}
            <div
              onClick={handleInviteClick}
              className="ml-3 flex h-[30px] w-[73px] cursor-pointer items-center justify-center gap-1 rounded-lg border border-gray03 md:h-[36px] md:w-[109px]"
            >
              <Image
                src="/images/header/invitation.svg"
                alt="초대하기"
                width={20}
                height={20}
                className="hidden md:inline-block"
              />
              <span className="text-center">초대하기</span>
            </div>
          </>
        )}
        {/* 멤버 이니셜 표시 */}
        <div className="ml-6">
          {currentDashboardId && memberData?.totalCount > 0 && <MemberInitials dashboardId={currentDashboardId} />}
        </div>
        {/* 구분선 */}
        <div className="mx-6 h-8 w-px bg-gray-300"></div>
      </div>
    </div>
  );
};