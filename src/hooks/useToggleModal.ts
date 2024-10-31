import { DeleteModalStateAtom, initiModalState, ModalStateAtom } from "@/store/modalAtom";
import { useSetAtom } from "jotai";

// 모달 상태를 토글하는 함수
export const useToggleModal = () => {
  const setModalState = useSetAtom(ModalStateAtom);

  return (modalName: keyof typeof initiModalState, isOpen: boolean) => {
    setModalState((prev) => ({ ...prev, [modalName]: isOpen }));
  };
};

// 삭제 모달 상태 관리
export const useDeleteModal = () => {
  const setDeleteModalState = useSetAtom(DeleteModalStateAtom);
  const setModalState = useSetAtom(ModalStateAtom);

  return (confirm: () => void, title: string) => {
    setDeleteModalState({ title, confirm });
    setModalState((prev) => ({ ...prev, deleteModal: true }));
  };
};
