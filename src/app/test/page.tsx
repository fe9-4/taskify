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
import { CreateDashboardAtom } from "@/store/modalAtom";
import { useAtom } from "jotai";

export default function Home() {
  const [, setisCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const onClick = () => {
    console.log(`클릭 테스트`);
  };
  return (
    <div className="my-[100px] flex flex-col items-center justify-items-center gap-1">
      <AddColumnBtn onClick={onClick} />
      <AddDashboardBtn onClick={() => setisCreateDashboardOpen(true)} />
      <AddTodoBtn onClick={onClick} />
      <DeleteDashboardBtn onClick={onClick} />
      <DashboardCard onClick={onClick} dashboardName="비브리지" isMine={false} color="#7AC555" />
      <DashboardCard onClick={onClick} dashboardName="비브리지" isMine={true} color="#7AC555" />
      <ActiveBtn onClick={onClick} disabled={false}>
        로그인
      </ActiveBtn>
      <ActiveBtn onClick={onClick} disabled={true}>
        로그인
      </ActiveBtn>
      <DeleteCancelBtn onClick={onClick}>삭제</DeleteCancelBtn>
      <DeleteCancelBtn onClick={onClick}>취소</DeleteCancelBtn>
      <InsertBtn onClick={onClick}>입력</InsertBtn>
      <div className="h-[42px] w-[138px] md:h-12 md:w-[120px]">
        <CancelBtn onClick={onClick}>취소</CancelBtn>
      </div>
      <div className="h-[42px] w-[138px] md:h-12 md:w-[120px]">
        <ConfirmBtn onClick={onClick}>확인</ConfirmBtn>
      </div>
      <CombiBtn onClickAccept={onClick} onClickRefuse={onClick} value={["수락", "거절"]}></CombiBtn>
      <BackForwardBtn onClickPrev={onClick} onClickNext={onClick} disabled={true} />
      <BackForwardBtn onClickPrev={onClick} onClickNext={onClick} disabled={false} />
    </div>
  );
}
