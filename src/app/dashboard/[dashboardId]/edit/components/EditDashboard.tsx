"use client";

import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { useForm } from "react-hook-form";
import SelectColorChip from "@/components/chip/SelectColorChip";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { DashboardInfoType, ValueType } from "@/types/dashboardType";
import { useCallback, useEffect, useState } from "react";

const EditDashboard = ({ dashboardId }: { dashboardId: number }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({ mode: "onChange" });

  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoType>({
    id: 0,
    title: "TITLE",
    color: "#000000",
    createdAt: "2024-01-01T19:54:48.459Z",
    updatedAt: "2024-01-01T19:19:34.157Z",
    userId: 0,
    createdByMe: false,
  });
  const { title, color, createdByMe } = dashboardInfo;
  // 대시보드 정보 요청 - 대시보드 수정하고 새로운 정보 가져오기
  const fetchDashboardInfo = useCallback(async () => {
    try {
      const res = await axios.get(`/api/dashboards/${dashboardId}?dashboardId=${dashboardId}`);
      setDashboardInfo(res.data);
    } catch (err) {
      const error = err as AxiosError;
      console.error(error.message);
    }
  }, [dashboardId]);

  useEffect(() => {
    fetchDashboardInfo();
  }, [fetchDashboardInfo]);

  const onClickEdit = (value: ValueType) => {
    const newTitle = value.title;
    const newColor = value.color;
    setDashboardInfo((prev) => ({ ...prev, title: newTitle, color: newColor }));
  };

  // 대시보드 수정 api 요청
  const updateDashboard = async (value: ValueType) => {
    try {
      const res = await axios.put(`/api/dashboards/${dashboardId}?dashboardId=${dashboardId}`, value);
      const data = res.data;
      toast.success("대시보드 정보가 수정되었습니다");
    } catch (err) {
      const error = err as AxiosError;
      console.error(error.message);
      toast.error("대시보드 변경에 실패했습니다");
    }
  };
  // 1.실패시에는 state 값도 변경이 안되어야함
  // 2. 사이드바랑 헤더도 같이 변경되어야함

  // input에 입력한 값을 value로 가져오기
  const onSubmit = () => {
    const formData = watch() as ValueType;
    updateDashboard(formData);
    onClickEdit(formData);
  };

  return (
    <div className="w-full rounded-2xl bg-white px-4 py-5 md:px-7 md:py-8">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">{title || "TITLE"}</h2>
      <InputItem id="title" {...register("title", { required: true })} label="대시보드 이름" type="text" />
      <div className="mb-8 mt-4 md:mb-10">
        <SelectColorChip register={register} watch={watch} />
      </div>
      <div className="flex h-[54px] w-full gap-2">
        <ActiveBtn disabled={!isValid && !createdByMe} onClick={handleSubmit(onSubmit)}>
          변경
        </ActiveBtn>
      </div>
    </div>
  );
};

export default EditDashboard;
