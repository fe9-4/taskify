"use client";
import { DashboardItem } from "@/components/sidebar/DashboardList";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ItemType } from "@/types/dashboardType";

export default function Home() {
  const item: ItemType = {
    id: 12043,
    title: "오렌지 테스트",
    color: "#FFA500",
    userId: 4668,
    createdAt: "2024-10-23T09:38:23.613Z",
    updatedAt: "2024-10-23T09:38:23.613Z",
    createdByMe: true,
  };
  return (
    <>
      <Sidebar />;
      <div className="ml-[400px]">
        <DashboardItem key={1} item={item} />
      </div>
    </>
  );
}
