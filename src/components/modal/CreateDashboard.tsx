"use client";

import { useAtom } from "jotai";
import { ActiveBtn, CancelBtn } from "@/components/ButtonComponents";
import InputItem from "@/components/input/InputItem";
import { CreateDashboardAtom } from "./modalAtom";
import { useForm } from "react-hook-form";
import SelectColorChip from "@/components/chip/SelectColorChip";

const CreateDashboard = () => {
  const { register, handleSubmit, watch } = useForm();
  const [, setisCreateDashboardOpen] = useAtom(CreateDashboardAtom);

  // api 연결 전 버튼 테스트용
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="w-[327px] rounded-lg bg-white px-4 py-5 md:w-[584px] md:p-8">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">새로운 대시보드</h2>
      <InputItem id="title" {...register("title")} label="대시보드 이름" type="text" />
      <div className="mb-8 mt-4 md:mb-10">
        <SelectColorChip register={register} watch={watch} />
      </div>
      <div className="flex h-[54px] w-full gap-2">
        <CancelBtn onClick={() => setisCreateDashboardOpen(false)}>취소</CancelBtn>
        {/* title 및 color 미입력시 생성 버튼 비활성화 */}
        <ActiveBtn disabled={!watch("title") || !watch("color")} onClick={handleSubmit(onSubmit)}>
          생성
        </ActiveBtn>
      </div>
    </div>
  );
};

export default CreateDashboard;
