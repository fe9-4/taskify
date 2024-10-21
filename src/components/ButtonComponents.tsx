import { cls } from "@/lib/utils";
import { BaseBtn, Content, ContentLeftAlign } from "./ButtonSetting";

export const PlusIcon = () => {
  return <span className="flex h-6 w-6 items-center justify-center rounded bg-violet02 text-violet01">+</span>;
};

export const AddColumnBtn = () => {
  return (
    <BaseBtn>
      <Content extra="h-[66px] w-[284px] text-lg md:h-[70px] md:w-[544px] md:text-xl xl:h-[70px] xl:w-[354px] font-bold">
        새로운 컬럼 추가하기
        <PlusIcon />
      </Content>
    </BaseBtn>
  );
};

export const AddDashboardBtn = () => {
  return (
    <BaseBtn>
      <Content extra="font-semibold text-base	h-[58px] w-[260px] md:h-[66px] md:w-[247px] md:text-lg xl:h-[70px] xl:w-[332px] font-bold">
        새로운 대시보드
        <PlusIcon />
      </Content>
    </BaseBtn>
  );
};

export const AddTodoBtn = () => {
  return (
    <BaseBtn>
      <Content extra="h-[32px] w-[284px] md:h-[40px] md:w-[544px] xl:w-[314px]">
        <PlusIcon />
      </Content>
    </BaseBtn>
  );
};

export const DeleteDashboardBtn = () => {
  return (
    <BaseBtn>
      <Content extra="h-[52px] w-[284px] text-lg font-medium md:h-[62px] md:w-[320px] md:text-xl">
        대시보드 삭제하기
      </Content>
    </BaseBtn>
  );
};

export const DashboardCard = ({ dashboardName = "비브리지" }) => {
  return (
    <BaseBtn>
      <ContentLeftAlign extra="h-[58px] w-[260px] text-lg font-medium md:h-[68px] md:w-[247px] md:text-xl xl:w-[332px] xl:h-[70px]">
        {dashboardName}
      </ContentLeftAlign>
    </BaseBtn>
  );
};
//아이콘 추가 -> prop으로 색깔 받아서 반영 & 내가 만든 대시보드 여부 -> 왕관 아이콘

// form 채웠을때 활성화되는 버튼 (로그인, 각종 모달)
export const ActiveBtn = (props: any) => {
  return (
    <button
      type="submit"
      disabled={props.disabled}
      className={cls(
        "h-[50px] w-[351px] rounded-lg bg-violet01 text-xl font-medium text-white md:w-[520px]",
        props.disabled ? "bg-gray02" : ""
      )}
    >
      {props.children}
    </button>
  );
};
export const DeleteCancelBtn = (props: any) => {
  return (
    <BaseBtn extra="rounded-[4px]">
      <Content extra="text-violet01 font-medium	text-xs md:text-base w-[52px] h-[32px] md:w-[84px]">
        {props.children}
      </Content>
    </BaseBtn>
  );
};
export const InsertBtn = (props: any) => {
  return (
    <BaseBtn extra="rounded-[4px]">
      <Content extra="text-violet01 font-medium	text-xs w-[84px] h-[28px] md:h-[32px]">{props.children}</Content>
    </BaseBtn>
  );
};

export const CancelBtn = (props: any) => {
  return (
    <BaseBtn>
      <Content extra="text-gray01 font-medium	text-xs w-[138px] h-[42px] md:h-[48px] md:w-[120px] md:text-lg">
        {props.children}
      </Content>
    </BaseBtn>
  );
};
export const ConfirmBtn = (props: any) => {
  return (
    <BaseBtn>
      <Content extra="bg-violet01 text-white font-semibold text-xs w-[138px] h-[42px] md:h-[48px] md:w-[120px] md:text-lg">
        {props.children}
      </Content>
    </BaseBtn>
  );
};

//초대 수락/거절 버튼
export const AcceptBtn = (props: any) => {
  return (
    <BaseBtn>
      <Content extra="w-[109px] h-[32px] md:w-[72px] md:h-[30px] xl:w-[84px] xl:h-[32px] bg-violet01 text-white font-medium text-xs md:text-base">
        {props.children}
      </Content>
    </BaseBtn>
  );
};
export const RefuseBtn = (props: any) => {
  return (
    <BaseBtn>
      <Content extra="w-[109px] h-[32px] md:w-[72px] md:h-[30px] xl:w-[84px] xl:h-[32px] bg-white text-violet01 font-medium text-xs md:text-base">
        {props.children}
      </Content>
    </BaseBtn>
  );
};
export const CombiBtn = ({ value }: { value: string[] }) => {
  return (
    <div className="flex w-[100%] justify-center gap-[10px]">
      <AcceptBtn>{value[0]}</AcceptBtn>
      <RefuseBtn>{value[1]}</RefuseBtn>
    </div>
  );
};
