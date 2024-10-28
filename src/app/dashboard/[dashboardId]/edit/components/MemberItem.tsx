"use client";

import { DeleteCancelBtn } from "@/components/button/ButtonComponents";
import { Member } from "@/zodSchema/memberSchema";
import Image from "next/image";
import toast from "react-hot-toast";
/* 초대 res
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
const MemberItem = ({ member, onClick }: { member: Member; onClick: (userId: number, nickname: string) => void }) => {
  const { nickname, profileImageUrl, userId } = member;

  const onClickDeleteMember = (userId: number, nickname: string) => {
    if (member.isOwner === false) {
      onClick(userId, nickname);
    } else toast("대시보드를 생성한 유저는 삭제할 수 없습니다");
  };
  const pastelColors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-indigo-200",
    "bg-red-200",
    "bg-teal-200",
  ];
  return (
    <div className="flex w-full justify-between border-b border-gray04 px-5 py-3 md:px-7 md:py-4">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="size-[38px] overflow-hidden rounded-full">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              width={50}
              height={50}
              alt="프로필"
              className="size-[38px] rounded-full object-center"
            />
          ) : (
            <div className={`flex size-full items-center justify-center ${pastelColors[userId % pastelColors.length]}`}>
              {nickname.slice(0, 1)}
            </div>
          )}
        </div>
        <div>{nickname}</div>
      </div>
      <DeleteCancelBtn onClick={() => onClickDeleteMember(userId, nickname)}>삭제</DeleteCancelBtn>
    </div>
  );
};

export default MemberItem;