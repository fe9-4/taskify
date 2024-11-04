import { atom } from "jotai";

// 모달 상태 초기값
export const initiModalState = {
  createDashboard: false, // 대시보드 생성 모달
  createCard: false, // 할 일 카드 생성 모달
  detailCard: false, //할 일 카드 상세 모달
  updateCard: false, // 할 일 카드 수정 모달
  createColumn: false, // 컬럼 생성 모달
  editColumn: false, // 컬럼 수정 모달
  invitationDashboard: false, // 대시 보드 초대 모달
  deleteModal: false, // 알람 모달
};

// 모달 상태 atom
export const ModalStateAtom = atom(initiModalState);

// 삭제 모달 state
type DeleteModalState = { title: string; confirm: () => void };

export const DeleteModalStateAtom = atom<DeleteModalState>({
  title: " ",
  confirm: () => null,
});

export const CardIdAtom = atom<number>(0);
export const ColumnTitlesAtom = atom<string[]>([]);
export const ColumnAtom = atom<{ columnId: number; title: string }>({ columnId: 0, title: "" });

export const RefreshDashboardAtom = atom<boolean>(false);
