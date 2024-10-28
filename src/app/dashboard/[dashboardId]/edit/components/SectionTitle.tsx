import { PaginationBtn } from "@/components/button/ButtonComponents";
import { InvitationDashboardAtom } from "@/store/modalAtom";
import { useAtom } from "jotai";
import { useState } from "react";
import { CiSquarePlus } from "react-icons/ci";

// 초대하기 모달 추가
const MemberInfo = () => <div className="text-base font-normal text-gray02 md:text-lg">이름</div>;
const EmailInfo = () => <div className="text-base font-normal text-gray02 md:text-lg">이메일</div>;
const InviteButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="flex items-center gap-[10px] rounded bg-violet01 px-3 py-2 text-xs text-white"
    type="button"
    onClick={onClick}
  >
    초대하기 <CiSquarePlus strokeWidth={1} />
  </button>
);

const SectionTitle = ({ sectionTitle }: { sectionTitle: string }) => {
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [, setIsInvitationDashboardOpen] = useAtom(InvitationDashboardAtom);

  const size = sectionTitle === "구성원" ? 4 : 5;
  const totalPage: number = Math.ceil(totalCount / size);
  const isFirst = page === 1;
  const isLast = page === totalPage;

  const onClickPrev = () => {
    if (!isFirst) setPage(page - 1);
  };
  const onClickNext = () => {
    if (!isLast) setPage(page + 1);
  };
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-3 md:flex md:justify-between">
      <h2 className="col-start-1 text-2xl font-bold md:text-3xl">{sectionTitle}</h2>
      <div className="item-center col-start-2 flex justify-end gap-3 text-xs md:gap-4 md:text-base">
        {totalPage} 중 {page}
        <PaginationBtn
          disabledPrev={isFirst}
          disabledNext={isLast}
          onClickPrev={onClickPrev}
          onClickNext={onClickNext}
        />
      </div>
      <div className="col-start-2 row-start-2 flex justify-end">
        {sectionTitle === "구성원" ? <></> : <InviteButton onClick={() => setIsInvitationDashboardOpen(true)} />}
      </div>
      <div className="col-start-1 row-start-2">{sectionTitle === "구성원" ? <MemberInfo /> : <EmailInfo />}</div>
    </div>
  );
};

export default SectionTitle;
