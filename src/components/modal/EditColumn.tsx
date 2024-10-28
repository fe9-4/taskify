import { useForm, useWatch } from "react-hook-form";
import InputItem from "../input/InputItem";
import { CancelBtn, ConfirmBtn } from "../button/ButtonComponents";
import { useAtom, useAtomValue } from "jotai";
import { ColumnTitlesAtom, EditColumnAtom } from "@/store/modalAtom";
import { useParams } from "next/navigation";
import useLoading from "@/hooks/useLoading";
import axios from "axios";
import toast from "react-hot-toast";
import { IoIosClose } from "react-icons/io";

const EditColumn = () => {
  const [, setIsEditColumnOpen] = useAtom(EditColumnAtom);
  const { dashboardId } = useParams();
  const { isLoading, withLoading } = useLoading();
  const ColumnTitles = useAtomValue(ColumnTitlesAtom);
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm();

  const title = useWatch({ control, name: "title" });
  const isDuplicate = ColumnTitles.includes(title);

  const onSubmit = async (data: any) => {
    await withLoading(async () => {
      try {
        console.log("test");
        toast.success("컬럼 수정 완료");
        // setIsEditColumnOpen(false);
      } catch (error) {
        toast.error("컬럼 수정 실패");
        // setIsEditColumnOpen(false);
      }
    });
  };

  return (
    <div className="w-[327px] rounded-lg bg-white px-4 py-6 md:w-[568px] md:p-6">
      <div className="mb-4 flex justify-between md:mb-6">
        <h2 className="text-2xl font-bold md:text-3xl">컬럼 관리</h2>
        <button className="">
          <IoIosClose />
        </button>
      </div>
      <InputItem
        id="title"
        {...register("title", { required: true })}
        label="이름"
        type="text"
        placeholder="새 컬럼 이름을 적어주세요"
        errors={isDuplicate ? "중복된 컬럼 이름입니다." : ""}
      />
      <div className="mt-6 flex h-[54px] w-full gap-2">
        <CancelBtn onClick={() => setIsEditColumnOpen(false)}>삭제</CancelBtn>
        <ConfirmBtn disabled={!isValid || isLoading || isDuplicate} onClick={handleSubmit(onSubmit)}>
          생성
        </ConfirmBtn>
      </div>
    </div>
  );
};

export default EditColumn;
