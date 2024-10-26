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

const CreateCardForm = () => {
  const { dashboardId } = useParams();
  const [columnList, setColumnList] = useState<IColumnList["data"]>([]);

  const getColumn = useCallback(async () => {
    try {
      const response = await axios.get(`/api/columns?dashboardId=${dashboardId}`);

      if (response.status === 200) {
        setColumnList(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("대시보드 컬럼 목록 조회 api에서 오류 발생", error);
        toast.error(error.response?.data);
      }
    }
  }, [dashboardId]);

  useEffect(() => {
    getColumn();
  }, [getColumn]);

  return (
    <div>
      {columnList.map((column) => (
        <CreateCard key={column.id} columnId={column.id} />
      ))}
    </div>
  );
};

export default CreateCardForm;
