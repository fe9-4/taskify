import { cls } from "@/lib/utils";
import { BaseBtn, Content, ContentLeftAlign, PlusIcon } from "./ButtonSetting";
import { FaCrown, FaCircle } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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
      <Content extra="h-8 w-[284px] md:h-[40px] md:w-[544px] xl:w-[314px]">
        <PlusIcon />
      </Content>
    </BaseBtn>
  );
};

export const DeleteDashboardBtn = () => {
  return (
    <BaseBtn>
      <Content extra="h-[52px] w-[284px] text-lg font-medium md:h-[62px] md:w-80 md:text-xl">대시보드 삭제하기</Content>
    </BaseBtn>
  );
};

export const DashboardCard = ({
  dashboardName,
  isMine,
  color,
}: {
  dashboardName: string;
  isMine: boolean;
  color: string;
}) => {
  return (
    <BaseBtn>
      <ContentLeftAlign extra=" flex gap-1 md:gap-1.5 xl:gap-2 h-[58px] w-[260px] text-lg font-semibold md:h-[68px] md:w-[247px] md:text-xl xl:w-[332px] xl:h-[70px]">
        <FaCircle className="mr-2 size-[8px] md:mr-[9px] xl:mr-4" fill={color} />
        {dashboardName}
        {isMine ? <FaCrown fill="#FDD446" /> : <></>}
      </ContentLeftAlign>
    </BaseBtn>
  );
};

// form 채웠을때 활성화되는 버튼 (로그인, 각종 모달)
export const ActiveBtn = ({ disabled, children }: { disabled: boolean; children: string }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cls(
        "h-[50px] w-[351px] rounded-lg text-xl font-medium text-white md:w-[520px]",
        disabled ? "cursor-not-allowed bg-gray02" : "bg-violet01"
      )}
    >
      {children}
    </button>
  );
};
export const DeleteCancelBtn = ({ children }: { children: string }) => {
  return (
    <BaseBtn extra="rounded-[4px]">
      <Content extra="text-violet01 font-medium	text-xs md:text-base w-[52px] h-8 md:w-[84px]">{children}</Content>
    </BaseBtn>
  );
};
export const InsertBtn = ({ children }: { children: string }) => {
  return (
    <BaseBtn extra="rounded-[4px]">
      <Content extra="text-violet01 font-medium	text-xs w-[84px] h-7 md:h-8">{children}</Content>
    </BaseBtn>
  );
};

export const CancelBtn = ({ children }: { children: string }) => {
  return (
    <BaseBtn>
      <Content extra="text-gray01 font-medium	text-xs w-[138px] h-[42px] md:h-12 md:w-[120px] md:text-lg">
        {children}
      </Content>
    </BaseBtn>
  );
};
export const ConfirmBtn = ({ children }: { children: string }) => {
  return (
    <BaseBtn>
      <Content extra="bg-violet01 text-white font-semibold text-xs w-[138px] h-[42px] md:h-12 md:w-[120px] md:text-lg">
        {children}
      </Content>
    </BaseBtn>
  );
};

//초대 수락/거절 버튼
export const AcceptBtn = ({ children }: { children: string }) => {
  return (
    <BaseBtn>
      <Content extra="w-[109px] h-8 md:w-[72px] md:h-[30px] xl:w-[84px] xl:h-8 bg-violet01 text-white font-medium text-xs md:text-base">
        {children}
      </Content>
    </BaseBtn>
  );
};
export const RefuseBtn = ({ children }: { children: string }) => {
  return (
    <BaseBtn>
      <Content extra="w-[109px] h-8 md:w-[72px] md:h-[30px] xl:w-[84px] xl:h-8 bg-white text-violet01 font-medium text-xs md:text-base">
        {children}
      </Content>
    </BaseBtn>
  );
};
export const CombiBtn = ({ value }: { value: string[] }) => {
  if (!Array.isArray(value) || value.length < 2) {
    console.error("CombiBtn 컴포넌트는 [문자열, 문자열] 을 value 속성으로 받아야합니다.");
    return null;
  }
  return (
    <div className="flex w-full justify-center space-x-2.5">
      <AcceptBtn>{value[0]}</AcceptBtn>
      <RefuseBtn>{value[1]}</RefuseBtn>
    </div>
  );
};

export const BackForwardBtn = ({ disabled }: { disabled: boolean }) => {
  return (
    <div className="flex h-10 w-20 items-center justify-center overflow-hidden rounded-[4px] border border-gray03 md:h-[36px] md:w-[72px]">
      <button
        type="button"
        disabled={disabled}
        className={cls(
          "flex size-full items-center justify-center border-r border-gray03",
          disabled ? "cursor-not-allowed" : ""
        )}
      >
        <IoIosArrowBack className={cls("size-4", disabled ? "text-gray03" : "text-black03")} />
      </button>
      <button
        type="button"
        disabled={disabled}
        className={cls("flex size-full items-center justify-center", disabled ? "cursor-not-allowed" : "")}
      >
        <IoIosArrowForward className={cls("size-4", disabled ? "text-gray03" : "text-black03")} />
      </button>
    </div>
  );
};
