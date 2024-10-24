import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { IInvitation } from "@/types/myDashboardType";
import { HiOutlineSearch } from "react-icons/hi";
import { cls } from "@/lib/utils";

// 제작중이어서 작업하면 PR 올리겠습니다.
const Invitation = () => {
  const [invitationList, setInvitationList] = useState<IInvitation["invitations"]>([]);
  const [search, setSearch] = useState("");

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

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  }

  const filteredSearch = invitationList.filter((item) => item.dashboard.title.includes(search));
  
  return (
    <div className={cls("flex flex-col space-y-[105px] bg-white px-5 pb-20 pt-6 xl:w-[1022px]", invitationList.length > 0 ? "pb-6 space-y-[10px]" : "")}>
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
          <div className="flex flex-col space-y-[13px]">
            <div className="flex items-center space-x-[10px] border border-gray03 rounded-md px-3 py-[5px]">
              <HiOutlineSearch />
              <input type="text" value={search} onChange={handleChangeSearch} className="w-full focus:outline-none" placeholder="검색" />
            </div>
            <div className="flex flex-col space-y-[14px]">
              <div className="flex items-center space-x-6">
                <h3 className="w-12 text-gray02">이름</h3>
                <span>프로덕트 디자인</span>
              </div>
              <div className="flex items-center space-x-6">
                <h3 className="w-12 text-gray02">초대자</h3>
                <span>손동희</span>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Invitation;
