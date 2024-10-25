import toast from "react-hot-toast";
import { PaginationBtn } from "@/components/button/ButtonComponents";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface IProps {
  totalPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

const Pagination = ({ totalPage, setPage, page }: IProps) => {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsDisabled(totalPage === page);
  }, [page, totalPage]);

  const handlePageNext = () => {
    const nextPage = page + 1;

    if (nextPage > totalPage) {
      setIsDisabled(true);
      toast.error("마지막 페이지입니다.");
    } else {
      setPage(nextPage);
      setIsDisabled(false);
    }
  };

  const handlePagePrev = () => {
    const prevPage = page - 1;

    if (prevPage < 1) {
      setPage(1);
      setIsDisabled(true);
      toast.error("첫 번째 페이지입니다.");
    } else {
      setPage(prevPage);
      setIsDisabled(false);
    }
  };

  return (
    <PaginationBtn onClickNext={handlePageNext} onClickPrev={handlePagePrev} disabledPrev={isDisabled} disabledNext />
  );
};

export default Pagination;
