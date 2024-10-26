"use client";

import { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { useAuth } from "@/hooks/useAuth";
import axios, { AxiosError } from "axios";
import DashboardMemberItem from "./DashboardMemberItem";
import { usePathname } from "next/navigation";
import InvitationsItemType from "@/types/invitationType";

const DashboardMemberList = ({ sectionTitle }: { sectionTitle: string }) => {
  // 이미 초대되어있는 멤버 = 구성원
  // 초대 진행중인 멤버 = 초대 내역
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [invitatingMemberList, setInvitatingMemberList] = useState<InvitationsItemType[]>([]);

  const { user } = useAuth();
  const pathname = usePathname();

  const dashboardId = pathname
    .split("/")
    .filter((segment) => !isNaN(Number(segment)))
    .join("");

  /*
{
  "invitations": [
    {
      "id": 13452,
      "inviter": {
        "id": 4668,
        "email": "yelim@fe.fe",
        "nickname": "yelim"
      },
      "teamId": "9-4",
      "dashboard": {
        "id": 12067,
        "title": "수정테스트"
      },
      "invitee": {
        "id": 4701,
        "email": "cccwon5@naver.com",
        "nickname": "슈퍼펭귄스"
      },
      "inviteAccepted": null,
      "createdAt": "2024-10-26T08:59:15.950Z",
      "updatedAt": "2024-10-26T08:59:15.950Z"
    }
  ],
  "totalCount": 1
}
*/

  const fetchDashboardMemberList = async (page: number, size: number) => {
    if (user) {
      try {
        const res = await axios.get(`/api/dashboards/${dashboardId}/invitations?page=${page}&size=${size}`);
        const data = res.data;
        setInvitatingMemberList(data.user ? data.user.invitations : []);
        setTotalCount(data.user.totalCount);
      } catch (err) {
        const error = err as AxiosError;
        console.error(error.message);
      }
    }
  };
  // useEffect(() => {
  //   fetchDashboardMemberList(page, size);
  // }, [user, page, size]);

  return (
    <section className="w-full rounded-2xl bg-white px-4 py-5 md:px-7 md:py-8">
      <SectionTitle sectionTitle={sectionTitle} />
      {/* <div>
        {invitatingMemberList.length > 0 &&
          invitatingMemberList.map((item) => <DashboardMemberItem key={item.id} item={item} />)}
      </div> */}
    </section>
  );
};

export default DashboardMemberList;
