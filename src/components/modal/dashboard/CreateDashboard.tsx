"use client";

import InputItem from "@/components/input/InputItem";
import { useForm } from "react-hook-form";
import SelectColorChip from "@/components/chip/SelectColorChip";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useLoading from "@/hooks/useLoading";
import { CancelBtn, ConfirmBtn } from "../../button/ButtonComponents";
import { useToggleModal } from "@/hooks/useModal";

const CreateDashboard = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({ mode: "onChange" });
  const router = useRouter();
  const { isLoading, withLoading } = useLoading();

  const toggleModal = useToggleModal();

  const onSubmit = async (data: any) => {
    await withLoading(async () => {
      try {
        const res = await axios.post("/api/dashboards", data);
        toast.success("대시보드 생성 완료");
        const dashboardId = res.data.user.id;
        router.push(`/dashboard/${dashboardId}`);
        toggleModal("createDashboard", false);
      } catch (error) {
        toast.error("대시보드 생성 실패");
        toggleModal("createDashboard", false);
      }
    });
  };

  return (
    <div className="w-[327px] rounded-lg bg-white px-4 py-5 md:w-[584px] md:p-8">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">새로운 대시보드</h2>
      <InputItem
        id="title"
        {...register("title", { required: true })}
        label="대시보드 이름"
        type="text"
        placeholder="대시보드 이름을 적어주세요"
      />
      <div className="mb-8 mt-4 md:mb-10">
        <SelectColorChip register={register} watch={watch} />
      </div>
      <div className="flex h-[54px] w-full gap-2">
        <CancelBtn onClick={() => toggleModal("createDashboard", false)}>취소</CancelBtn>
        <ConfirmBtn disabled={!isValid || isLoading} onClick={handleSubmit(onSubmit)}>
          {isLoading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-t-transparent" />
            </>
          ) : (
            "생성"
          )}
        </ConfirmBtn>
      </div>
    </div>
  );
};

export default CreateDashboard;
