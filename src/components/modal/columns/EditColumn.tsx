import { useForm, useWatch } from "react-hook-form";
import InputItem from "../../input/InputItem";
import { CancelBtn, ConfirmBtn } from "../../button/ButtonComponents";
import { useAtomValue, useSetAtom } from "jotai";
import { ColumnAtom, ColumnTitlesAtom, RefreshDashboardAtom } from "@/store/modalAtom";
import useLoading from "@/hooks/useLoading";
import axios from "axios";
import toast from "react-hot-toast";
import { IoIosClose } from "react-icons/io";
import { useDeleteModal, useToggleModal } from "@/hooks/useModal";
import toastMessages from "@/lib/toastMessage";

const EditColumn = () => {
  const toggleModal = useToggleModal();
  const setDeleteModal = useDeleteModal();
  const setRefreshDashboard = useSetAtom(RefreshDashboardAtom);
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
        toast.success(toastMessages.success.editColumn);
        toggleModal("editColumn", false);
        setRefreshDashboard((prev) => !prev);
      } catch (error) {
        toast.error(toastMessages.error.editColumn);
        toggleModal("editColumn", false);
      }
    });
  };

  const onDelete = async () => {
    await withLoading(async () => {
      try {
        await axios.delete(`/api/columns/${Column.columnId}`);
        toast.success(toastMessages.success.deleteColumn);
        toggleModal("deleteModal", false);
        toggleModal("editColumn", false);
        setRefreshDashboard((prev) => !prev);
      } catch (error) {
        toast.error(toastMessages.error.deleteColumn);
        toggleModal("deleteModal", false);
      }
    });
  };

  return (
    <div className="w-[327px] rounded-lg bg-white px-4 py-6 md:w-[568px] md:p-6">
      <div className="mb-4 flex justify-between md:mb-6">
        <h2 className="text-2xl font-bold md:text-3xl">컬럼 관리</h2>
        <button className="size-9" onClick={() => toggleModal("editColumn", false)}>
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
            setDeleteModal(onDelete, "컬럼의 모든 카드가 삭제됩니다.");
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
