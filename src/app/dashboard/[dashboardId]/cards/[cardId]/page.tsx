"use client";

import CreateCard from "@/components/cards/CreateCard";
import UpdateCard from "@/components/cards/UpdateCard";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface IColumnData {
  id: number;
  title: string;
  teamId: string;
}
interface IColumnList {
  data: IColumnData[];
}

const UpdateCardForm = () => {
  const searchParams = useSearchParams();
  const cursorId = searchParams.get("cursorId");
  const columnId = searchParams.get("columnId");
  const size = searchParams.get("size");
  const [cardList, setCardList] = useState([]);

  const getCards = async () => {
    try {
      const response = await axios.get(`/api/cards?size=${size}&cursorId=${cursorId}&columnId=${columnId}`);

      if (response.status === 200) {
        setCardList(response.data.cards);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("카드 목록 조회 api에서 오류 발생", error);
        toast.error(error.response?.data);
      }
    }
  };

  useEffect(() => {
    getCards();
  }, [getCards]);

  return (
    <>
      <UpdateCard />
    </>
  );
};

export default UpdateCardForm;
