"use client";

import { DeleteCancelBtn } from "@/components/button/ButtonComponents";
import { Member } from "@/zodSchema/memberSchema";
import Image from "next/image";
import toast from "react-hot-toast";
import { Montserrat } from "next/font/google";
import toastMessages from "@/lib/toastMessage";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const MemberItem = ({ member, onClick }: { member: Member; onClick: (userId: number, nickname: string) => void }) => {
  const { nickname, profileImageUrl, userId, id, email } = member;

  const onClickDeleteMember = (id: number, nickname: string) => {
    if (member.isOwner) {
      toast.error(toastMessages.error.isDashboardOwner);
    } else {
      onClick(id, nickname);
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
    <div className="flex w-full justify-between border-b border-gray04 px-5 py-3 last:border-0 md:px-7 md:py-4">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="size-[34px] overflow-hidden rounded-full md:size-[38px]">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              width={40}
              height={40}
              alt="프로필"
              className={`size-[38px] rounded-full object-center`}
            />
          ) : (
            <div
              className={`flex size-full items-center justify-center text-[14px] font-semibold leading-[17px] ${montserrat.variable} font-montserrat text-white md:text-[17px] md:leading-5 ${pastelColors[userId % pastelColors.length]}`}
            >
              {email.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="text-base font-normal md:text-lg">{nickname}</div>
      </div>
      <DeleteCancelBtn onClick={() => onClickDeleteMember(id, nickname)}>삭제</DeleteCancelBtn>
    </div>
  );
};

export default MemberItem;
