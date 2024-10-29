"use client";

import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { FieldValues, useForm } from "react-hook-form";
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
    reset,
    formState: { isValid, isDirty },
  } = useForm<FieldValues>({ mode: "onChange" });

  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoType | null>(null);

  // 대시보드 정보 요청 - 대시보드 수정하고 새로운 정보 가져오기
  const fetchDashboardInfo = useCallback(async () => {
    try {
      const res = await axios.get(`/api/dashboards/${dashboardId}`);
      setDashboardInfo(res.data);
      reset({ title: dashboardInfo?.title, color: dashboardInfo?.color });
    } catch (err) {
      const error = err as AxiosError;
      console.error(error.message);
    }
  }, [dashboardId]);

  useEffect(() => {
    fetchDashboardInfo();
  }, [fetchDashboardInfo]);

  useEffect(() => {
    if (dashboardInfo) {
      reset({
        title: dashboardInfo.title,
        color: dashboardInfo.color,
      });
    }
  }, [dashboardInfo, reset]);

  // 대시보드 수정 api 요청
  const updateDashboard = async (value: ValueType) => {
    try {
      const res = await axios.put(`/api/dashboards/${dashboardId}`, value);
      const data = res.data;
      setDashboardInfo((prev) => {
        if (prev) {
          return { ...prev, title: data.title, color: data.color };
        }
        return prev;
      });
      toast.success("대시보드 정보가 수정되었습니다");
    } catch (err) {
      const error = err as AxiosError;
      console.error(error.message);
      toast.error("대시보드 변경에 실패했습니다");
    }
  };

  const onSubmit = () => {
    const formData = watch() as ValueType;
    updateDashboard(formData);
  };

  const isButtonDisabled = !isValid || !isDirty;

  return (
    <div className="w-full rounded-2xl bg-white px-4 py-5 md:px-7 md:py-8">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">{dashboardInfo?.title || "TITLE"}</h2>
      <InputItem id="title" {...register("title", { required: true })} label="대시보드 이름" type="text" />
      <div className="mb-8 mt-4 md:mb-10">
        <SelectColorChip register={register} watch={watch} />
      </div>
      <div className="flex h-[54px] w-full gap-2">
        <ActiveBtn disabled={isButtonDisabled} onClick={handleSubmit(onSubmit)}>
          변경
        </ActiveBtn>
      </div>
    </div>
  );
};

export default EditDashboard;
