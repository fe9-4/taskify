import { useForm, useWatch } from "react-hook-form";
import InputItem from "../../input/InputItem";
import { CancelBtn, ConfirmBtn } from "../../button/ButtonComponents";
import { useAtom, useAtomValue } from "jotai";
import {
  AlertModalAtom,
  AlertModalConfirmAtom,
  AlertModalTextAtom,
  ColumnAtom,
  ColumnTitlesAtom,
  EditColumnAtom,
  RefreshDashboardAtom,
} from "@/store/modalAtom";
import useLoading from "@/hooks/useLoading";
import axios from "axios";
import toast from "react-hot-toast";
import { IoIosClose } from "react-icons/io";

const EditColumn = () => {
  const [, setIsEditColumnOpen] = useAtom(EditColumnAtom);
  const [, setRefreshDashboard] = useAtom(RefreshDashboardAtom);
  const [, setIsAlertOpen] = useAtom(AlertModalAtom);
  const [, setAlertText] = useAtom(AlertModalTextAtom);
  const [, setOnConfirm] = useAtom(AlertModalConfirmAtom);
  const { isLoading, withLoading } = useLoading();
  const ColumnTitles = useAtomValue(ColumnTitlesAtom);
  const Column = useAtomValue(ColumnAtom);
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({ defaultValues: { title: Column.title } });

  const title = useWatch({ control, name: "title" });
  const isDuplicate = ColumnTitles.includes(title);

  const onSubmit = async (data: any) => {
    await withLoading(async () => {
      try {
        await axios.put(`/api/columns/${Column.columnId}`, { ...data, columnId: Column.columnId });
        toast.success("컬럼 수정 완료");
        setIsEditColumnOpen(false);
        setRefreshDashboard((prev) => !prev);
      } catch (error) {
        toast.error("컬럼 수정 실패");
        setIsEditColumnOpen(false);
      }
    });
  };

  const onDelete = async () => {
    await withLoading(async () => {
      try {
        await axios.delete(`/api/columns/${Column.columnId}`);
        toast.success("컬럼 삭제 완료");
        setIsAlertOpen(false);
        setIsEditColumnOpen(false);
        setRefreshDashboard((prev) => !prev);
      } catch (error) {
        toast.error("컬럼 삭제 실패");
        setIsAlertOpen(false);
      }
    });
  };

  return (
    <div className="w-[327px] rounded-lg bg-white px-4 py-6 md:w-[568px] md:p-6">
      <div className="mb-4 flex justify-between md:mb-6">
        <h2 className="text-2xl font-bold md:text-3xl">컬럼 관리</h2>
        <button className="size-9" onClick={() => setIsEditColumnOpen(false)}>
          <IoIosClose className="size-9 text-[#6b6b6b]" />
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
        <CancelBtn
          onClick={() => {
            setOnConfirm(() => onDelete);
            setAlertText("컬럼의 모든 카드가 삭제됩니다.");
            setIsAlertOpen(true);
          }}
        >
          삭제
        </CancelBtn>
        <ConfirmBtn disabled={!isValid || isLoading || isDuplicate} onClick={handleSubmit(onSubmit)}>
          수정
        </ConfirmBtn>
      </div>
    </div>
  );
};

export default EditColumn;