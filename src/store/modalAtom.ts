import { atom } from "jotai";

//대시보드 생성 모달
export const CreateDashboardAtom = atom<boolean>(false);

// 할 일 카드 생성 모달
export const CreateCardAtom = atom<boolean>(false);
export const CreateCardParamsAtom = atom<string>("");

//할 일 카드 상세 모달
export const DetailCardAtom = atom<boolean>(false);
export const DetailCardParamsAtom = atom<string>("");

// 할 일 카드 수정 모달
export const UpdateCardAtom = atom<boolean>(false);
export const UpdateCardParamsAtom = atom<string>("");

// 컬럼 생성 모달
export const CreateColumnAtom = atom<boolean>(false);
export const ColumnTitlesAtom = atom<string[]>([]);

// 컬럼 수정 모달
export const EditColumnAtom = atom<boolean>(false);
export const ColumnAtom = atom<{ columnId: number; title: string }>({ columnId: 0, title: "" });

// 대시 보드 초대 모달
export const InvitationDashboardAtom = atom<boolean>(false);

// 알람 모달
export const AlertModalAtom = atom<boolean>(false);
export const AlertModalTextAtom = atom<string>("");
export const AlertModalConfirmAtom = atom<(() => void) | null>(null);

export const RefreshDashboardAtom = atom<boolean>(false);
