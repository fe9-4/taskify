import toast from "react-hot-toast";
import { PaginationBtn } from "@/components/button/ButtonComponents";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import toastMessages from "@/lib/toastMessage";

interface IProps {
  totalPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

const Pagination = ({ totalPage, setPage, page }: IProps) => {
  const [isDisabledNext, setIsDisabledNext] = useState(false);
  const [isDisabledPrev, setIsDisabledPrev] = useState(false);

  useEffect(() => {
    if (totalPage > 0) {
      setIsDisabledPrev(page === 1);
      setIsDisabledNext(page === totalPage);
    }
  }, [page, totalPage]);

  const handlePageNext = (e: MouseEvent) => {
    e.stopPropagation();
    const nextPage = page + 1;

    if (nextPage > totalPage) {
      setIsDisabledNext(true);
      toast.error(toastMessages.error.lasgPage);
    } else {
      setPage(nextPage);
      setIsDisabledNext(false);
    }
  };

  const handlePagePrev = (e: MouseEvent) => {
    e.stopPropagation();
    const prevPage = page - 1;

    if (prevPage < 1) {
      setPage(1);
      setIsDisabledPrev(true);
      toast.error(toastMessages.error.firstPage);
    } else {
      setPage(prevPage);
      setIsDisabledPrev(false);
    }
  };

  return (
    <PaginationBtn
      onClickNext={handlePageNext}
      onClickPrev={handlePagePrev}
      disabledNext={isDisabledNext}
      disabledPrev={isDisabledPrev}
    />
  );
};

export default Pagination;
