"use client";

import { DeleteCancelBtn } from "@/components/button/ButtonComponents";
import { cls } from "@/lib/utils";
import { Member } from "@/zodSchema/memberSchema";
import Image from "next/image";
import toast from "react-hot-toast";

const MemberItem = ({ member, onClick }: { member: Member; onClick: (userId: number, nickname: string) => void }) => {
  const { nickname, profileImageUrl, userId, id } = member;

  const onClickDeleteMember = (userId: number, nickname: string) => {
    if (member.isOwner) {
      toast.error("대시보드를 생성한 유저는 삭제할 수 없습니다");
    } else {
      onClick(userId, nickname);
    }
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
    // border 스타일 추후 수정
    <div className={cls("flex w-full justify-between border-b border-gray04 px-5 py-3 md:px-7 md:py-4")}>
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
      <DeleteCancelBtn onClick={() => onClickDeleteMember(id, nickname)}>삭제</DeleteCancelBtn>
    </div>
  );
};

export default MemberItem;