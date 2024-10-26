import { useForm } from "react-hook-form";
import InputItem from "../input/InputItem";
import { CancelBtn, ConfirmBtn } from "../button/ButtonComponents";
import { useAtom } from "jotai";
import { CreateColumnAtom } from "@/store/modalAtom";
import { useParams } from "next/navigation";

const CreateColumn = () => {
  const [, setIsCreateColumnOpen] = useAtom(CreateColumnAtom);
  const dashboardId = useParams();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log({ ...data, ...dashboardId });
  };

  return (
    <div className="w-[327px] rounded-lg bg-white px-4 py-6 md:w-[568px] md:p-6">
      <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">새 컬럼 생성</h2>
      <InputItem
        id="title"
        {...register("title", { required: true })}
        label="이름"
        type="text"
        placeholder="새 컬럼 이름을 적어주세요"
      />
      <div className="mt-6 flex h-[54px] w-full gap-2">
        <CancelBtn onClick={() => setIsCreateColumnOpen(false)}>취소</CancelBtn>
        <ConfirmBtn disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          생성
        </ConfirmBtn>
      </div>
    </div>
  );
};

export default CreateColumn;
