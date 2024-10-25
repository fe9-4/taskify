"use client";

import SectionTitle from "./SectionTitle";

const DashboardMemberList = ({ sectionTitle }: { sectionTitle: string }) => {
  // 데이터가 두개 필요
  // 이미 초대되어있는 멤버 = 구성원 -> useMember 훅
  // 초대 진행중인 멤버 = 초대 내역 -> useInvitationMember 훅

  return (
    <section className="w-full rounded-2xl bg-white px-4 py-5 md:px-7 md:py-8">
      <SectionTitle sectionTitle={sectionTitle} />
      <div>{/* list-> map((item)=> <DashboardMemberItem>) */}</div>
    </section>
  );
};

export default DashboardMemberList;
