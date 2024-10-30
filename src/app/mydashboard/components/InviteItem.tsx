import axios from "axios";
import toast from "react-hot-toast";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { CombiBtn } from "@/components/button/ButtonComponents";
import { currentDashboardIdAtom, myDashboardUpdateAtom } from "@/store/myDashboardAtom";
import { IInvitation } from "@/types/myDashboardType";
import { HiOutlineSearch } from "react-icons/hi";

interface IProps {
  invitationList: IInvitation["invitations"];
  setInvitationList: Dispatch<SetStateAction<IInvitation["invitations"]>>;
}

const InviteItem = ({ invitationList, setInvitationList }: IProps) => {
  const [search, setSearch] = useState("");
  const [, setMyDashboardUpdated] = useAtom(myDashboardUpdateAtom);
  const currentDashboardId = useAtomValue(currentDashboardIdAtom);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  };
  
  const filteredSearch = invitationList.filter((item) =>
    item.dashboard.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAcceptInvitation = async (id: number, dashboardId: number) => {
    try {
      const checkAlreadyDashboard = currentDashboardId.includes(dashboardId);

      if (checkAlreadyDashboard) {
        toast.error("이미 존재하는 대시보드입니다.");
        return;
      }

      const response = await axios.put(`/api/invitations/${id}`, {
        id,
        inviteAccepted: true,
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

  const handleRefuseInvitation = async (id: number) => {
    try {
      const response = await axios.put(`/api/invitations/${id}`, {
        id,
        inviteAccepted: false,
      });

      if (response.status === 200) {
        toast.success("초대를 거절하였습니다.");
        setInvitationList((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("대시보드 초대 거절 요청에서 api 오류 발생", error);
        toast.error(error.response?.data);
      }
    }
  };

  return (
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
          className="flex flex-col space-y-[14px] overflow-auto border-b border-gray04 pb-4 md:flex-row md:md:items-center md:justify-between md:space-y-0 md:pr-8 xl:px-10"
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
              onClickAccept={() => handleAcceptInvitation(item.id, item.dashboard.id)}
              onClickRefuse={() => handleRefuseInvitation(item.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InviteItem;
