import { useState } from "react";
import toast from "react-hot-toast";
import { PaginationBtn } from "@/components/button/ButtonComponents";
import { CiSquarePlus } from "react-icons/ci";
import { useAtom } from "jotai";
import { InvitationDashboardAtom } from "@/store/modalAtom";
import InviteItem from "./InviteItem";
import Image from "next/image";
import { useInvitation } from "@/hooks/useInvitation";
import { Invitation } from "@/zodSchema/invitationSchema";

const InviteList = ({ dashboardId }: { dashboardId: number }) => {
  const [page, setPage] = useState(1);
  const size = 5;
  const [, setIsInvitationDashboardOpen] = useAtom(InvitationDashboardAtom);

  // useInvitation 훅 사용
  const { invitationList, cancelInvitation, isCanceling } = useInvitation({
    dashboardId,
  });

  const totalPage: number = Math.ceil(invitationList.totalCount / size);
  const isFirst = page === 1;
  const isLast = page === totalPage;

  const onClickPrev = () => {
    if (!isFirst) setPage(page - 1);
  };

  const onClickNext = () => {
    if (!isLast) setPage(page + 1);
  };

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
      <div className="flex items-center justify-between px-5 py-6 md:px-7 md:py-[26px]">
        <h2 className="col-start-1 text-2xl font-bold md:text-3xl">초대 내역</h2>
        <div className="flex items-center gap-3 md:gap-4">
          <div>
            {totalPage} 중 {page}
          </div>
          <PaginationBtn
            disabledPrev={isFirst && totalPage === 1}
            disabledNext={isLast && invitationList.totalCount < size}
            onClickPrev={onClickPrev}
            onClickNext={onClickNext}
          />
          <button
            className="flex items-center gap-[10px] rounded bg-violet01 px-3 py-2 text-xs text-white"
            type="button"
            onClick={() => setIsInvitationDashboardOpen(true)}
          >
            초대하기 <CiSquarePlus strokeWidth={1} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-5 md:px-7">
        {invitationList.invitations.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-6 py-5">
            <Image
              src="/images/myDashboard/invitation.svg"
              alt="초대"
              width={60}
              height={60}
              className="md:size-[100px]"
            />
            <div className="px-5 md:px-7">아직 초대된 멤버가 없습니다</div>
          </div>
        )}
      </div>
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
