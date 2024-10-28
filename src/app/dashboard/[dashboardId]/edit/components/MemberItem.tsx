"use client";

import { DeleteCancelBtn } from "@/components/button/ButtonComponents";
import { Member } from "@/zodSchema/memberSchema";
import Image from "next/image";
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
const MemberItem = ({ member }: { member: Member }) => {
  const { nickname, profileImageUrl } = member;

  const onClickDeleteMember = () => {
    // 구성원 삭제하기 api
  };

  return (
    <div className="w-full border-b border-gray04 px-5 md:px-7">
      <div className="flex items-center justify-between">
        {profileImageUrl && (
          <div className="overflow-hidden">
            <Image
              src={profileImageUrl}
              width={50}
              height={50}
              alt="프로필"
              className="size-[38px] rounded-full object-center"
            />
          </div>
        )}
        <div>{nickname}</div>
        <DeleteCancelBtn onClick={onClickDeleteMember}>삭제</DeleteCancelBtn>
      </div>
    </div>
  );
};

export default MemberItem;
