import { IInvitation } from "@/types/myDashboardType";
import Image from "next/image";
import { useState } from "react";

const Invitation = () => {
  const [invitationList, setInvitationList] = useState<IInvitation["invitations"]>([]);

  return (
    <div className="flex flex-col space-y-[105px] bg-white px-5 pb-20 pt-6 xl:w-[1022px]">
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
        <div></div>
      )}
    </div>
  );
};

export default Invitation;
