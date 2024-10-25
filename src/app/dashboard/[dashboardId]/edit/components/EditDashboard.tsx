"use client";

import { ActiveBtn } from "@/components/button/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { useForm } from "react-hook-form";
import SelectColorChip from "@/components/chip/SelectColorChip";
//  {/* 620 544  284 : edit 창*/}
const EditDashboard = ({ title }: { title: string }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({ mode: "onChange" });

  // api 연결 전 버튼 테스트용
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    // 기존 값 자동으로 불러와야할까?
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
