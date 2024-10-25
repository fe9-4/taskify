import { PaginationBtn } from "@/components/button/ButtonComponents";
import { useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { useAtom } from "jotai";
// 초대하기 모달 없음 !?

const SectionTitle = () => {
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const onClickInvitation = () => {};

  const size = 4; // prop으로 받기 (title:구성원 -> 4, title:초대내역 -> 5)
  const totalPage: number = Math.ceil(totalCount / size);
  return (
    <div className="flex justify-between">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">구성원 OR 초대내역</h2>
      <div className="flex gap-4">
        <div>
          {totalPage} 중 {page}
        </div>
        <PaginationBtn disabledPrev disabledNext onClickPrev onClickNext />
        <div>이름 OR 이메일</div>
        <button type="button" onClick={onClickInvitation}>
          초대하기 <CiSquarePlus />
        </button>
      </div>
    </div>
  );
};

export default SectionTitle;
