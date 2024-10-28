"use client";

import {
  ActiveBtn,
  AddColumnBtn,
  AddDashboardBtn,
  AddTodoBtn,
  CancelBtn,
  CombiBtn,
  ConfirmBtn,
  DashboardCard,
  DeleteCancelBtn,
  DeleteDashboardBtn,
  InsertBtn,
  PaginationBtn,
} from "@/components/button/ButtonComponents";
import { AlertModalAtom, AlertModalTextAtom, CreateCardAtom, CreateDashboardAtom } from "@/store/modalAtom";
import { useAtom } from "jotai";

export default function Home() {
  const [, setIsCreateDashboardOpen] = useAtom(CreateDashboardAtom);
  const [, setIsCreateCard] = useAtom(CreateCardAtom);
  const [, setIsAlertOpen] = useAtom(AlertModalAtom);
  const [, setAlertText] = useAtom(AlertModalTextAtom);
  const onClick = () => {
    console.log(`클릭 테스트`);
  };
  return (
    <div className="m-4 flex flex-col gap-4">
      <div>
        <AddColumnBtn onClick={() => setIsCreateCard(true)} />
      </div>
      <div>
        <AddDashboardBtn onClick={() => setIsCreateDashboardOpen(true)} />
      </div>
      <div>
        <AddTodoBtn
          onClick={() => {
            setAlertText("비밀번호가 일치하지 않습니다.");
            setIsAlertOpen(true);
          }}
        />
      </div>
      <div>
        <DeleteDashboardBtn
          onClick={() => {
            setAlertText("가입이 완료되었습니다!");
            setIsAlertOpen(true);
          }}
        />
      </div>

      <div>
        <DashboardCard onClick={onClick} dashboardName="비브리지" isMine={false} color="#7AC555" />
      </div>
      <div>
        <DashboardCard onClick={onClick} dashboardName="비브리지" isMine={true} color="#7AC555" />
      </div>
      <div>
        <ActiveBtn onClick={onClick} disabled={false}>
          로그인
        </ActiveBtn>
      </div>
      <div>
        <ActiveBtn onClick={onClick} disabled={true}>
          로그인
        </ActiveBtn>
      </div>
      <div>
        <DeleteCancelBtn onClick={onClick}>삭제</DeleteCancelBtn>
      </div>
      <div>
        <DeleteCancelBtn onClick={onClick}>취소</DeleteCancelBtn>
      </div>
      <div>
        <InsertBtn onClick={onClick}>입력</InsertBtn>
      </div>
      <div className="h-[42px] w-[138px] md:h-12 md:w-[120px]">
        <CancelBtn onClick={onClick}>취소</CancelBtn>
      </div>
      <div className="h-[42px] w-[138px] md:h-12 md:w-[120px]">
        <ConfirmBtn
          type="submit"
          disabled={false}
          extra={`"cursor-not-allowed bg-gray02" : "bg-violet01"`}
          onClick={onClick}
        >
          확인
        </ConfirmBtn>
      </div>
      <div className="h-[42px] w-[138px] md:h-12 md:w-[120px]">
        <ConfirmBtn
          type="submit"
          disabled={true}
          extra={`"cursor-not-allowed bg-gray02" : "bg-violet01"`}
          onClick={onClick}
        >
          확인
        </ConfirmBtn>
      </div>
      <CombiBtn onClickAccept={onClick} onClickRefuse={onClick} value={["수락", "거절"]}></CombiBtn>
      <PaginationBtn onClickPrev={onClick} onClickNext={onClick} disabledPrev={true} disabledNext={false} />
      <PaginationBtn onClickPrev={onClick} onClickNext={onClick} disabledPrev={true} disabledNext={true} />
    </div>
  );
}
