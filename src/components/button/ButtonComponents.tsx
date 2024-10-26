import { cls } from "@/lib/utils";
import { BaseBtn, Content, ContentLeftAlign, PlusIcon } from "@/components/button/ButtonSetting";
import { FaCrown, FaCircle } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// 1. 버튼 텍스트가 정해져있는 경우
// 1) 컬럼 추가
export const AddColumnBtn = ({ onClick }: any) => {
  return (
    <BaseBtn onClick={onClick}>
      <Content extra="h-[66px] w-[284px] text-lg md:h-[70px] md:w-[544px] md:text-xl xl:h-[70px] xl:w-[354px] font-bold">
        새로운 컬럼 추가하기
        <PlusIcon />
      </Content>
    </BaseBtn>
  );
};

//2) 대시보드 추가
export const AddDashboardBtn = ({ onClick }: any) => {
  return (
    <BaseBtn onClick={onClick}>
      <Content extra="font-semibold text-base	h-[58px] w-[260px] md:h-[66px] md:w-[247px] md:text-lg xl:h-[70px] xl:w-[332px] font-bold">
        새로운 대시보드
        <PlusIcon />
      </Content>
    </BaseBtn>
  );
};

//3) 투두 추가
export const AddTodoBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <BaseBtn onClick={onClick}>
      <Content extra="h-8 w-[284px] md:h-[40px] md:w-[544px] xl:w-[314px]">
        <PlusIcon />
      </Content>
    </BaseBtn>
  );
};

//4) 대시보드 삭제
export const DeleteDashboardBtn = ({ onClick }: any) => {
  return (
    <BaseBtn onClick={onClick} extra="bg-gay03">
      <Content extra="h-[52px] w-[284px] text-lg font-medium md:h-[62px] md:w-80 md:text-xl">대시보드 삭제하기</Content>
    </BaseBtn>
  );
};

// 2. 버튼 내부에 들어갈 요소를 prop으로 받는 경우
// 1) 대시보드 카드 (사이드바)
export const DashboardCard = ({
  dashboardName,
  isMine,
  color,
  onClick,
}: {
  dashboardName: string;
  isMine: boolean;
  color: string;
  onClick: any;
}) => {
  return (
    <BaseBtn onClick={onClick}>
      <ContentLeftAlign extra="flex gap-1 md:gap-1.5 xl:gap-2 h-[58px] w-[260px] text-lg font-semibold md:h-[68px] md:w-[247px] md:text-xl xl:w-[332px] xl:h-[70px]">
        <FaCircle className="mr-2 size-[8px] md:mr-[9px] xl:mr-4" fill={color} />
        {dashboardName}
        {isMine ? <FaCrown fill="#FDD446" /> : <></>}
      </ContentLeftAlign>
    </BaseBtn>
  );
};

// 2) form 채웠을때 활성화되는 버튼 (로그인, 회원가입, 각종 모달)
export const ActiveBtn = ({ disabled, children, onClick }: { disabled: boolean; children: string; onClick: any }) => {
  return (
    <button
      onClick={onClick}
      type="submit"
      disabled={disabled}
      className={cls(
        "h-[50px] w-full rounded-lg text-xl font-medium text-white",
        disabled ? "cursor-not-allowed bg-gray02" : "bg-violet01"
      )}
    >
      {children}
    </button>
  );
};

//3) 삭제 / 피그마 표기 : Component24
export const DeleteCancelBtn = ({ children, onClick }: { children: string; onClick: any }) => {
  return (
    <BaseBtn extra="rounded-[4px]" onClick={onClick}>
      <Content extra="text-violet01 font-medium	text-xs md:text-base w-[52px] h-8 md:w-[84px]">{children}</Content>
    </BaseBtn>
  );
};

//4) 입력  / 피그마 표기 : Component24
export const InsertBtn = ({ children, onClick }: { children: string; onClick: any }) => {
  return (
    <BaseBtn extra="rounded-[4px]" onClick={onClick}>
      <Content extra="text-violet01 font-medium	text-xs w-[84px] h-7 md:h-8">{children}</Content>
    </BaseBtn>
  );
};

//5) 취소 / 피그마 표기 : modal
export const CancelBtn = ({ children, onClick, ...props }: { children: string; onClick: any; props?: any }) => {
  return (
    <BaseBtn extra="size-full" onClick={onClick} props={props}>
      <Content extra="text-gray01 font-medium	text-xs md:text-lg">{children}</Content>
    </BaseBtn>
  );
};
// 6) 확인 / 피그마 표기 : modal
export const ConfirmBtn = ({
  children,
  onClick,
  disabled,
  extra,
  ...props
}: {
  disabled?: boolean;
  children: string;
  onClick: any;
  extra?: any;
  props?: any;
}) => {
  return (
    <BaseBtn
      disabled={disabled}
      extra={cls("size-full", disabled ? "cursor-not-allowed" : "")}
      onClick={onClick}
      props={props}
    >
      <Content
        extra={cls(disabled ? "bg-gray02" : "bg-violet01", "text-white font-semibold text-xs w-full h-full md:text-lg")}
      >
        {children}
      </Content>
    </BaseBtn>
  );
};

//초대 수락/거절 버튼
export const AcceptBtn = ({ children, onClick }: { children: string; onClick: any }) => {
  return (
    <BaseBtn onClick={onClick}>
      <Content extra="w-[109px] h-8 md:w-[72px] md:h-[30px] xl:w-[84px] xl:h-8 bg-violet01 text-white font-medium text-xs md:text-base">
        {children}
      </Content>
    </BaseBtn>
  );
};
export const RefuseBtn = ({ children, onClick }: { children: string; onClick: any }) => {
  return (
    <BaseBtn onClick={onClick}>
      <Content extra="w-[109px] h-8 md:w-[72px] md:h-[30px] xl:w-[84px] xl:h-8 bg-white text-violet01 font-medium text-xs md:text-base">
        {children}
      </Content>
    </BaseBtn>
  );
};

// 7) 수락 거절 버튼(위 2개 세트) / 피그마 표기 : button
export const CombiBtn = ({
  value,
  onClickAccept,
  onClickRefuse,
}: {
  value: string[];
  onClickAccept: any;
  onClickRefuse: any;
}) => {
  if (!Array.isArray(value) || value.length < 2) {
    console.error("CombiBtn 컴포넌트는 [문자열, 문자열] 을 value 속성으로 받아야합니다.");
    return null;
  }
  return (
    <div className="flex w-full justify-center space-x-2.5">
      <AcceptBtn onClick={onClickAccept}>{value[0]}</AcceptBtn>
      <RefuseBtn onClick={onClickRefuse}>{value[1]}</RefuseBtn>
    </div>
  );
};

// 8) 페이지네이션 버튼
export const PaginationBtn = ({
  disabledPrev,
  disabledNext,
  onClickPrev,
  onClickNext,
}: {
  disabledPrev: boolean;
  disabledNext: boolean;
  onClickPrev: any;
  onClickNext: any;
}) => {
  return (
    <div className="flex h-10 w-20 items-center justify-center overflow-hidden rounded-[4px] border border-gray03 md:h-[36px] md:w-[72px]">
      <button
        onClick={onClickPrev}
        type="button"
        disabled={disabledPrev}
        className={cls(
          "flex size-full items-center justify-center border-r border-gray03",
          disabledPrev ? "cursor-not-allowed" : ""
        )}
      >
        <IoIosArrowBack className={cls("size-4", disabledPrev ? "text-gray03" : "text-black03")} />
      </button>
      <button
        onClick={onClickNext}
        type="button"
        disabled={disabledNext}
        className={cls("flex size-full items-center justify-center", disabledNext ? "cursor-not-allowed" : "")}
      >
        <IoIosArrowForward className={cls("size-4", disabledNext ? "text-gray03" : "text-black03")} />
      </button>
    </div>
  );
};
