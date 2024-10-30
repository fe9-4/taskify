import { useState } from "react";
import toast from "react-hot-toast";
import { CiSquarePlus } from "react-icons/ci";
import InviteItem from "./InviteItem";
import Image from "next/image";
import Pagination from "@/components/pagination/Pagination";
import { useInvitation } from "@/hooks/useInvitation";
import { Invitation } from "@/zodSchema/invitationSchema";
import { useToggleModal } from "@/hooks/useToggleModal";

const InviteList = ({ dashboardId }: { dashboardId: number }) => {
  const [page, setPage] = useState(1);
  const size = 5;
  const toggleModal = useToggleModal();

  // useInvitation 훅 사용
  const { invitationList, cancelInvitation, isCanceling } = useInvitation({
    dashboardId,
  });

  const totalPage: number = Math.ceil(invitationList.totalCount / size);

  const onClickCancelInvitation = async (invitationId: number) => {
    try {
      await cancelInvitation(invitationId);
    } catch (error) {
      console.error(`Error canceling invitation: ${invitationId}`, error);
      toast.error("초대 취소 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-between px-5 pb-[18px] pt-[22px] md:px-7 md:py-[26px]">
        <h2 className="col-start-1 text-2xl font-bold md:text-3xl">초대 내역</h2>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="text-xs font-normal md:text-base">
            {totalPage} 중 {page}
          </div>
          <Pagination totalPage={totalPage} setPage={setPage} page={page} />

          <button
            className="absolute bottom-[-26px] right-[20px] flex h-[26px] items-center gap-[10px] rounded bg-violet01 px-3 py-1 text-xs text-white md:relative md:bottom-auto md:right-auto md:h-8 md:py-2"
            type="button"
            onClick={() => toggleModal("invitationDashboard", true)}
          >
            초대하기 <CiSquarePlus strokeWidth={1} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-5 md:px-7">
        {invitationList.invitations.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-6 pb-5 pt-10">
            <Image
              src="/images/myDashboard/invitation.svg"
              alt="초대"
              width={60}
              height={60}
              className="md:size-[100px]"
            />
            <div className="px-5 text-gray02 md:px-7">아직 초대된 멤버가 없습니다</div>
          </div>
        )}
      </div>
      {invitationList.invitations.length > 0 && (
        <div className="px-5 py-[1px] text-base font-normal text-gray02 md:px-7 md:text-lg">이메일</div>
      )}
      <ul>
        <li>
          {invitationList.invitations.map((item: Invitation) => (
            <InviteItem key={item.id} item={item} onClick={onClickCancelInvitation} disabled={isCanceling} />
          ))}
        </li>
      </ul>
    </>
  );
};

export default InviteList;
