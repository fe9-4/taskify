import { PaginationBtn } from "@/components/button/ButtonComponents";
import { useState } from "react";
import { CiSquarePlus } from "react-icons/ci";

// 초대하기 모달 추가
const onClickInvitation = () => {};
const MemberInfo = () => <div>이름</div>;
const EmailInfo = () => <div>이메일</div>;
const InviteButton = () => (
  <button type="button" onClick={onClickInvitation}>
    초대하기 <CiSquarePlus />
  </button>
);

const SectionTitle = ({ sectionTitle }: { sectionTitle: string }) => {
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(0);

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
    <div className="flex justify-between">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">{sectionTitle}</h2>
      <div className="flex gap-4">
        <div>
          {totalPage} 중 {page}
        </div>
        <PaginationBtn
          disabledPrev={isFirst}
          disabledNext={isLast}
          onClickPrev={onClickPrev}
          onClickNext={onClickNext}
        />
        {sectionTitle === "구성원" ? <MemberInfo /> : <EmailInfo />}
        {sectionTitle === "구성원" ? <></> : <InviteButton />}
      </div>
    </div>
  );
};

export default SectionTitle;
