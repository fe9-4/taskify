import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { IInvitation } from "@/types/myDashboardType";
import { HiOutlineSearch } from "react-icons/hi";
import { cls } from "@/lib/utils";
import { CombiBtn } from "../button/ButtonComponents";
import { useAtom } from "jotai";
import { myDashboardUpdateAtom } from "@/store/myDashboardAtom";

const Invitation = () => {
  const [invitationList, setInvitationList] = useState<IInvitation["invitations"]>([]);
  const [search, setSearch] = useState("");
  const [, setMyDashboardUpdated] = useAtom(myDashboardUpdateAtom);
  
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
  };

  const filteredSearch = invitationList.filter((item) => item.dashboard.title.toLowerCase().includes(search.toLowerCase()));

  const handleAcceptInvitation = async (id: number) => {
    try {
      const response = await axios.put(`/api/myDashboard/invitation/${id}`, {
        id,
        inviteAccepted: true
      });

      if (response.status === 200) {
        toast.success("대시보드가 추가되었습니다.");
        setInvitationList((prev) => prev.filter((item) => item.id !== id));
        setMyDashboardUpdated(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("대시보드 초대 수락 요청에서 api 오류 발생", error);
        toast.error(error.response?.data);
      }
    }
  };

  const handleRefuseInvitation = () => {};

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
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-[10px] rounded-md border border-gray03 px-3 py-[5px]">
            <HiOutlineSearch />
            <input
              type="text"
              value={search}
              onChange={handleChangeSearch}
              className="w-full focus:outline-none"
              placeholder="검색"
            />
          </div>
          <div className="hidden text-gray02 md:flex md:items-center md:justify-between md:pr-[85px] xl:px-10">
            <h3>이름</h3>
            <h3 className="ml-10 xl:ml-6">초대자</h3>
            <h3 className="text-gray02 xl:mr-16">수락 여부</h3>
          </div>
          {filteredSearch.map((item) => (
            <div
              key={item.id}
              className="flex flex-col space-y-[14px] border-b border-gray04 pb-4 md:flex-row md:md:items-center md:justify-between md:space-y-0 md:pr-8 xl:px-10"
            >
              <div className="flex items-center space-x-6 md:space-x-0">
                <h3 className="w-10 text-gray02 md:hidden">이름</h3>
                <span className="md:w-28">{item.dashboard.title}</span>
              </div>
              <div className="flex items-center space-x-6 md:space-x-0">
                <h3 className="text-gray02 md:hidden">초대자</h3>
                <span className="md:w-16 md:text-center">{item.inviter.nickname}</span>
              </div>
              <div>
                <CombiBtn
                  value={["수락", "거절"]}
                  onClickAccept={() => handleAcceptInvitation(item.id)}
                  onClickRefuse={handleRefuseInvitation}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invitation;
