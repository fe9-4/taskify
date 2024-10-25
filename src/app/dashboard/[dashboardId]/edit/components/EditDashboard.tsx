"use client";

import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { useForm } from "react-hook-form";
import SelectColorChip from "@/components/chip/SelectColorChip";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
const EditDashboard = ({ title }: { title: string }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({ mode: "onChange" });

  const { dashboardId } = useParams();

  const updateDashboard = async () => {
    try {
      const res = await axios.put(`/api/dashboards/${dashboardId}`);
      const data = res.data;
      console.log(data);
    } catch (err) {
      const error = err as AxiosError;
      console.error(error.message);
    }
  };
  // input에 입력한 값을 data로 가져오기
  const onSubmit = (data: any) => {
    updateDashboard();
  };

  return (
    <div className="w-full rounded-2xl bg-white px-4 py-5 md:px-7 md:py-8">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">{title}</h2>
      <InputItem id="title" {...register("title", { required: true })} label="대시보드 이름" type="text" />
      <div className="mb-8 mt-4 md:mb-10">
        <SelectColorChip register={register} watch={watch} />
      </div>
      <div className="flex h-[54px] w-full gap-2">
        <ActiveBtn disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          변경
        </ActiveBtn>
      </div>
    </div>
  );
};

export default EditDashboard;
