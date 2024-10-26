"use client";

import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { useForm } from "react-hook-form";
import SelectColorChip from "@/components/chip/SelectColorChip";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { DashboardInfoType, ValueType } from "@/types/dashboardType";

const EditDashboard = ({
  dashboardInfo,
  onClickEdit,
}: {
  dashboardInfo: DashboardInfoType;
  onClickEdit: (value: ValueType) => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({ mode: "onChange" });

  const { dashboardId } = useParams();
  const { title, color, createdByMe } = dashboardInfo;

  // 대시보드 수정 api 요청
  const updateDashboard = async (value: ValueType) => {
    try {
      const res = await axios.put(`/api/dashboards/${dashboardId}?dashboardId=${dashboardId}`, value);
      const data = res.data;
      toast("대시보드 정보가 수정되었습니다");
    } catch (err) {
      const error = err as AxiosError;
      console.error(error.message);
      toast("대시보드 변경에 실패했습니다");
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
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">{title}</h2>
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
