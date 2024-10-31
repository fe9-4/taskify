import { DeleteModalStateAtom, initiModalState, ModalStateAtom } from "@/store/modalAtom";
import { useSetAtom } from "jotai";
import { useCallback } from "react";

// 모달 상태를 토글 hook
export const useToggleModal = () => {
  const setModalState = useSetAtom(ModalStateAtom);

  return useCallback(
    (modalName: keyof typeof initiModalState, isOpen: boolean) => {
      setModalState((prev) => ({ ...prev, [modalName]: isOpen }));
    },
    [setModalState]
  );
};

// 삭제 모달 상태 관리 hook
export const useDeleteModal = () => {
  const setDeleteModalState = useSetAtom(DeleteModalStateAtom);
  const setModalState = useSetAtom(ModalStateAtom);

  return useCallback(
    (confirm: () => void, title: string) => {
      setDeleteModalState({ title, confirm });
      setModalState((prev) => ({ ...prev, deleteModal: true }));
    },
    [setDeleteModalState, setModalState]
  );
};
