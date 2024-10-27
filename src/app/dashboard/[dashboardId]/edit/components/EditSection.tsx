"use client";

import { useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { useAuth } from "@/hooks/useAuth";
import axios, { AxiosError } from "axios";
import MemberItem from "./MemberItem";
import { usePathname } from "next/navigation";
import InvitationsItemType from "@/types/invitationType";
import DashboardMemberList from "./DashboardMemberList";

const EditSection = ({ sectionTitle }: { sectionTitle: string }) => {
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

  const id = Number(dashboardId);

  const fetchDashboardInvitationList = async () => {
    if (user) {
      try {
        const res = await axios.get(`/api/dashboards/${dashboardId}/invitations`);
        const data = res.data;
        setInvitatingMemberList(data.user ? data.user.invitations : []);
        setTotalCount(data.user.totalCount);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error(err.message);
        } else {
          console.error("An unexpected error occurred", err);
        }
      }
    }
  };
  useEffect(() => {
    // fetchDashboardInvitationList();
  }, [user, page, size, dashboardId]);

  return (
    <section className="w-full rounded-2xl bg-white px-4 py-5 md:px-7 md:py-8">
      <SectionTitle sectionTitle={sectionTitle} />
      <DashboardMemberList dashboardId={id} />
    </section>
  );
};

export default EditSection;
