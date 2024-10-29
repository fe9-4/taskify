import { atom } from "jotai";

export const CreateCardAtom = atom<boolean>(false);
export const CreateCardParamsAtom = atom<string>("");
export const DetailCardAtom = atom<boolean>(false);
export const DetailCardParamsAtom = atom<string>("");
export const UpdateCardAtom = atom<boolean>(false);
export const UpdateCardParamsAtom = atom<string>("");

export const CreateDashboardAtom = atom<boolean>(false);
export const AlertModalAtom = atom<boolean>(false);
export const CreateColumnAtom = atom<boolean>(false);
export const EditColumnAtom = atom<boolean>(false);
export const InvitationDashboardAtom = atom<boolean>(false);

export const AlertModalTextAtom = atom<string>("");
export const ColumnAtom = atom<{ columnId: number; title: string }>({ columnId: 0, title: "" });
export const ColumnTitlesAtom = atom<string[]>([]);

export const AlertModalConfirmAtom = atom<(() => void) | null>(null);
