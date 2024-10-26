import toast from "react-hot-toast";
import { PaginationBtn } from "@/components/button/ButtonComponents";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface IProps {
  totalPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

const Pagination = ({ totalPage, setPage, page }: IProps) => {
  const [isDisabledNext, setIsDisabledNext] = useState(false);
  const [isDisabledPrev, setIsDisabledPrev] = useState(false);

  useEffect(() => {
    setIsDisabledNext(totalPage === page);
    setIsDisabledPrev(totalPage === page);
  }, [page, totalPage]);

  const handlePageNext = () => {
    const nextPage = page + 1;

    if (nextPage > totalPage) {
      setIsDisabledNext(true);
      toast.error("마지막 페이지입니다.");
    } else {
      setPage(nextPage);
      setIsDisabledNext(false);
    } 
  }
  
  const handlePagePrev = () => {
    const prevPage = page - 1;

    if (prevPage < 1) {
      setPage(1);
      setIsDisabledPrev(true);
      toast.error("첫 번째 페이지입니다.");
    } else {
      setPage(prevPage);
      setIsDisabledPrev(false);
    }
  };

  return <PaginationBtn onClickNext={handlePageNext} onClickPrev={handlePagePrev} disabledNext={isDisabledNext} disabledPrev={isDisabledPrev}   />
};

export default Pagination;
