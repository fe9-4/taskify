"use client";

import {
  ActiveBtn,
  AddColumnBtn,
  AddDashboardBtn,
  AddTodoBtn,
  BackForwardBtn,
  CancelBtn,
  CombiBtn,
  ConfirmBtn,
  DashboardCard,
  DeleteCancelBtn,
  DeleteDashboardBtn,
  InsertBtn,
} from "@/components/ButtonComponents";

export default function Home() {
  return (
    <div className="my-[100px] flex flex-col items-center justify-items-center gap-1">
      <AddColumnBtn />
      <AddDashboardBtn />
      <AddTodoBtn />
      <DeleteDashboardBtn />
      <DashboardCard dashboardName="비브리지" isMine={false} color="#7AC555" />
      <DashboardCard dashboardName="비브리지" isMine={true} color="#7AC555" />
      <ActiveBtn disabled={false}>로그인</ActiveBtn>
      <ActiveBtn disabled={true}>로그인</ActiveBtn>
      <DeleteCancelBtn>삭제</DeleteCancelBtn>
      <DeleteCancelBtn>취소</DeleteCancelBtn>
      <InsertBtn>입력</InsertBtn>
      <CancelBtn>취소</CancelBtn>
      <ConfirmBtn>확인</ConfirmBtn>
      <CombiBtn value={["수락", "거절"]}></CombiBtn>
      <BackForwardBtn disabled={true} />
      <BackForwardBtn disabled={false} />
    </div>
  );
}
