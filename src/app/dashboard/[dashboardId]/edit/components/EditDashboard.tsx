"use client";

import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { FieldValues, useForm } from "react-hook-form";
import SelectColorChip from "@/components/chip/SelectColorChip";
import { ValueType } from "@/types/dashboardType";
import { useEffect } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { UpdateDashboard } from "@/zodSchema/dashboardSchema";

const EditDashboard = ({ dashboardId }: { dashboardId: number }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isValid, isDirty },
  } = useForm<FieldValues>({ mode: "onChange" });

  const { dashboardInfo, updateDashboard, isUpdating } = useDashboard({ dashboardId });

  useEffect(() => {
    if (dashboardInfo) {
      reset({
        title: dashboardInfo.title,
        color: dashboardInfo.color,
      });
    }
  }, [dashboardInfo, reset]);

  const onSubmit = () => {
    const formData = watch() as UpdateDashboard;
    updateDashboard({ id: dashboardId, data: formData });
  };

  const isButtonDisabled = !isValid || !isDirty || isUpdating;

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
