import { cls } from "../../lib/utils";

// 지정된 색상의 명칭(커스텀 색상 명칭)을 받아 화면에 표시합니다.
const ColorChip = ({ color }: { color: string }) => {
  return <div className={cls("h-[30px] w-[30px] rounded-full", color !== "" ? `${color}` : "")} />;
};

export default ColorChip;
