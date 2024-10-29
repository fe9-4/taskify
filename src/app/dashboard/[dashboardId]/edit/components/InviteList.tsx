import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PaginationBtn } from "@/components/button/ButtonComponents";
import { CiSquarePlus } from "react-icons/ci";
import { useAtom } from "jotai";
import { InvitationDashboardAtom } from "@/store/modalAtom";
import InviteItem from "./InviteItem";
import Image from "next/image";
interface InvitationItem {
  id: number;
  inviter: {
    id: number;
    email: string;
    nickname: string;
  };
  teamId: string;
  dashboard: {
    id: number;
    title: string;
  };
  invitee: {
    id: number;
    email: string;
    nickname: string;
  };
  inviteAccepted: null | boolean;
  createdAt: string;
  updatedAt: string;
}
// onClick={() => setIsInvitationDashboardOpen(true)}
const InviteList = ({ dashboardId }: { dashboardId: number }) => {
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const size = 5;
  const [inviteList, setInviteList] = useState<InvitationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [, setIsInvitationDashboardOpen] = useAtom(InvitationDashboardAtom);

  const totalPage: number = Math.ceil(totalCount / size);
  const isFirst = page === 1;
  const isLast = page === totalPage;
  const onClickPrev = () => {
    if (!isFirst) setPage(page - 1);
  };
  const onClickNext = () => {
    if (!isLast) setPage(page + 1);
  };

  const fetchDashboardInvitationList = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/dashboards/${dashboardId}/invitations?page=${page}&size=${size}`);
      const data = res.data;
      
      setTotalCount(data.totalCount);
      const uniqueMembers = data.invitations.filter(
        (invitation: InvitationItem, index: number, self: InvitationItem[]) =>
          index === self.findIndex((inv) => inv.invitee.id === invitation.invitee.id)
      );
      setInviteList(uniqueMembers);
      setTotalCount(uniqueMembers.length);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardInvitationList();
  }, [dashboardId]);

  useEffect(() => {
    if (!isLoading && inviteList.length > 0) {
      const uniqueMembers = inviteList.filter(
        (invitation, index, self) => index === self.findIndex((inv) => inv.invitee.id === invitation.invitee.id)
      );
      if (uniqueMembers.length !== inviteList.length) {
        setInviteList(uniqueMembers);
      }
    }
  }, [isLoading]);

  const onClickCancelInvitation = async (invitationId: number) => {
    try {
      const response = await axios.delete(`/api/dashboards/${dashboardId}/invitations/${invitationId}`);
      if (response.status === 204) {
        toast.success(`멤버 초대를 취소합니다.`);
        const newList = inviteList.filter((item) => item.id !== invitationId);
        setInviteList(newList);
      } else {
        toast.error("삭제하는 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error(`Error deleting member: ${invitationId}`, err);
      toast.error("삭제하는 중 오류가 발생했습니다.");
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
            disabledNext={isLast && totalCount < size}
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
        {isLoading ? <div className="pb-5">초대 내역을 불러오고 있어요</div> : <></>}
        {error ? <div className="pb-5">초대 내역을 불러오는데 실패했습니다</div> : <></>}
        {inviteList.length === 0 ? (
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
        ) : (
          <></>
        )}
      </div>
      <ul>
        <li>
          {inviteList.map((item) => (
            <InviteItem key={item.id} item={item} onClick={onClickCancelInvitation} />
          ))}
        </li>
      </ul>
    </>
  );
};
export default InviteList;
