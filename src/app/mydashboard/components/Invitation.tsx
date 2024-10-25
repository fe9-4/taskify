import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import InviteList from "@/app/mydashboard/components/InviteList";
import { useCallback, useEffect, useState } from "react";
import { IInvitation } from "@/types/myDashboardType";
import { cls } from "@/lib/utils";

const Invitation = () => {
  const [invitationList, setInvitationList] = useState<IInvitation["invitations"]>([]);
  
  const getInvitationList = useCallback(async () => {
    try {
      const response = await axios.get("/api/myDashboard/invitation");

      if (response.status === 200) {
        setInvitationList(response.data.invitations);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("내 대시보드 초대받은 목록 조회 실패", error);
        toast.error(error.response?.data);
      }
    }
  }, []);

  useEffect(() => {
    getInvitationList();
  }, [getInvitationList]);

  return (
    <div
      className={cls(
        "flex flex-col space-y-[105px] bg-white px-5 pb-20 pt-6 xl:w-[1022px]",
        invitationList.length > 0 ? "space-y-[10px] pb-6" : ""
      )}
    >
      <h2 className="font-bold md:text-3xl">초대받은 대시보드</h2>
      {invitationList.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg">
          <Image
            src="/images/myDashboard/invitation.svg"
            alt="초대"
            width={60}
            height={60}
            className="md:size-[100px]"
          />
          <span className="text-xs text-gray02 md:text-xl">아직 초대받은 대시보드가 없어요</span>
        </div>
      ) : (
        <InviteList invitationList={invitationList} setInvitationList={setInvitationList} />
      )}
    </div>
  );
};

export default Invitation;
