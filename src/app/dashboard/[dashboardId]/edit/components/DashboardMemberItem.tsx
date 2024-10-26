"use client";

import { DeleteCancelBtn } from "@/components/button/ButtonComponents";
import InvitationsItemType from "@/types/invitationType";
/*
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
const DashboardMemberItem = ({ item }: { item: InvitationsItemType }) => {
  const onClickDeleteMember = () => {
    // 구성원 삭제하기
  };
  const onClickCancerInvitation = () => {
    // 초대 취소하기
  };
  const { invitee, inviteAccepted } = item;
  const { email, nickname } = invitee;

  return (
    <div className="w-full border-b border-gray04 px-5 md:px-7">
      <div className="flex items-center justify-between">
        {inviteAccepted ? (
          //프로필이미지 + 이름
          <div>
            <div className="rounded-full">{email.split("")[0]}</div>
            <div>{nickname}</div>
            <DeleteCancelBtn onClick={onClickDeleteMember}>삭제</DeleteCancelBtn>
          </div>
        ) : (
          // 이메일
          <div>
            <div>{email}</div>
            <DeleteCancelBtn onClick={onClickCancerInvitation}>취소</DeleteCancelBtn>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMemberItem;
