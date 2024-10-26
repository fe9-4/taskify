"use client";

import { DeleteCancelBtn } from "@/components/button/ButtonComponents";
import InvitationsItemType from "@/types/invitationType";

const DashboardMemberItem = ({ item }: { item: InvitationsItemType }) => {
  let isMember; // 불린값 prop으로 받기 (구성원 OR 초대내역)
  const onClickDeleteMember = () => {
    // 구성원 삭제하기
  };
  const onClickCancerInvitation = () => {
    // 초대 취소하기
  };
  const {} = item;
  return (
    <div className="w-full border-b border-gray04 px-5 md:px-7">
      <div className="flex items-center justify-between">
        {isMember ? (
          //프로필이미지 + 이름
          <DeleteCancelBtn onClick={onClickDeleteMember}>삭제</DeleteCancelBtn>
        ) : (
          // 이메일
          <DeleteCancelBtn onClick={onClickCancerInvitation}>취소</DeleteCancelBtn>
        )}
      </div>
    </div>
  );
};

export default DashboardMemberItem;
