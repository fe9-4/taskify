import React from "react";
import { SelectedDashboard } from "./SelectedDashboard";
import { MemberInitials } from "./MemberInitials";
import { useDashboard } from "@/hooks/useDashboard";
import { useMember } from "@/hooks/useMember";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { InvitationDashboardAtom } from "@/store/modalAtom";

export const DashboardMemberDisplay = () => {
  const router = useRouter();
  const params = useParams();
  const currentDashboardId = params?.dashboardId ? Number(params.dashboardId) : null;

  // 초대하기 모달 상태 관리
  const setIsInvitationDashboardOpen = useSetAtom(InvitationDashboardAtom);

  // 대시보드 목록 조회
  const {
    getDashboardById,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useDashboard({
    page: 1,
    size: 10,
    showErrorToast: true,
    customErrorMessage: "대시보드를 찾을 수 없습니다.",
  });

  // 현재 대시보드 정보 가져오기
  const currentDashboard = currentDashboardId ? getDashboardById(currentDashboardId) : null;

  // 멤버 목록 조회
  const {
    memberData,
    isLoading: isMemberLoading,
    error: memberError,
  } = useMember({
    dashboardId: currentDashboardId || 0,
    page: 1,
    size: 100,
    showErrorToast: true,
    customErrorMessage: "멤버 목록을 불러오는데 실패했습니다.",
  });

  // 초대하기 버튼 클릭 핸들러
  const handleInviteClick = () => {
    setIsInvitationDashboardOpen(true);
  };

  // 관리 버튼 클릭 핸들러
  const handleSettingClick = () => {
    router.push(`/dashboard/${currentDashboardId}/edit`);
  };

  // 로딩 중이거나 에러 발생 시 렌더링하지 않음
  if (isDashboardLoading || isMemberLoading || dashboardError || memberError) return null;

  // 대시보드 소유자 여부 확인
  const isDashboardOwner = currentDashboard?.createdByMe || false;

  return (
    <div className="flex h-full w-full items-center justify-between">
      {/* 대시보드 제목 영역 */}
      <div className="w-[100px] pl-1 md:w-[180px]">
        <SelectedDashboard title={currentDashboard?.title || null} isDashboardOwner={isDashboardOwner} />
      </div>

      {/* 대시보드 관리 버튼 영역 */}
      <div className="flex items-center gap-2 pr-1">
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
              className="flex h-[30px] w-[73px] cursor-pointer items-center justify-center gap-1 rounded-lg border border-gray03 md:h-[36px] md:w-[109px]"
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
        {currentDashboardId && memberData.total > 0 && <MemberInitials dashboardId={currentDashboardId} />}
        {/* 구분선 */}
        <div className="mx-4 h-8 w-px bg-gray-300"></div>
      </div>
    </div>
  );
};
