import axios from "axios";
import toast from "react-hot-toast";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useSetAtom } from "jotai";
import { CombiBtn } from "@/components/button/ButtonComponents";
import { myDashboardUpdateAtom } from "@/store/myDashboardAtom";
import { IInvitation } from "@/types/myDashboardType";
import { HiOutlineSearch } from "react-icons/hi";
import toastMessages from "@/lib/toastMessage";
import { useQueryClient } from "@tanstack/react-query";

interface IProps {
  invitationList: IInvitation["invitations"];
}

const InviteItem = ({ invitationList }: IProps) => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const setMyDashboardUpdated = useSetAtom(myDashboardUpdateAtom);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  };

  const filteredSearch = invitationList.filter((item) =>
    item.dashboard.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAcceptInvitation = async (id: number, dashboardId: number) => {
    try {
      const response = await axios.put(`/api/invitations/${id}`, {
        id,
        inviteAccepted: true,
      });

      if (response.status === 200) {
        toast.success(toastMessages.success.acceptInvitation);
        queryClient.invalidateQueries({ queryKey: ["invitations"] });
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
        toast.success(toastMessages.success.refuseInvitation);
        queryClient.invalidateQueries({ queryKey: ["invitations"] });
        setMyDashboardUpdated(true);
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
