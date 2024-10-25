"use client";

import { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { useAuth } from "@/hooks/useAuth";
import axios, { AxiosError } from "axios";
import DashboardMemberItem from "./DashboardMemberItem";
import { usePathname } from "next/navigation";

const DashboardMemberList = ({ sectionTitle }: { sectionTitle: string }) => {
  // 이미 초대되어있는 멤버 = 구성원
  // 초대 진행중인 멤버 = 초대 내역
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [invitatingMemberList, setInvitatingMemberList] = useState([]);

  const { user } = useAuth();
  const pathname = usePathname();

  const dashboardId = pathname.split("/").find((segment) => !isNaN(Number(segment)));

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
  useEffect(() => {
    fetchDashboardMemberList(page, size);
  }, [user, page, size]);
  return (
    <section className="w-full rounded-2xl bg-white px-4 py-5 md:px-7 md:py-8">
      <SectionTitle sectionTitle={sectionTitle} />
      <div>
        {invitatingMemberList.length > 0 && invitatingMemberList.map((item) => <DashboardMemberItem item={item} />)}
      </div>
    </section>
  );
};

export default DashboardMemberList;
