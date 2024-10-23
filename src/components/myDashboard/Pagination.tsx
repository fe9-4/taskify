import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BackForwardBtn } from "../button/ButtonComponents";
import toast from "react-hot-toast";

interface IProps {
  totalPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

const Pagination = ({ totalPage, setPage, page }: IProps) => {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsDisabled(totalPage === page);
  }, [page]);

  const handlePageNext = () => {
    const nextPage = page + 1;

    if (nextPage > totalPage) {
      setPage(totalPage);
      setIsDisabled(true);
      toast.error("마지막 페이지입니다.");
    } else {
      setPage(nextPage);
      setIsDisabled(false);
    } 
  }

  const handlePagePrev = () => {
    const prevPage = page - 1;
    setPage(prevPage);

    if (prevPage < 1) {
      setPage(1);
      setIsDisabled(true);
      toast.error("첫 번째 페이지입니다.");
    } else {
      setPage(prevPage);
      setIsDisabled(false);
    }
  }

  return <BackForwardBtn onClickNext={handlePageNext} onClickPrev={handlePagePrev} disabled={isDisabled} />
};

export default Pagination;
