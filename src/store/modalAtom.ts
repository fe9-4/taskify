import { atom } from "jotai";

export const CreateDashboardAtom = atom<boolean>(false);
export const CreateCardAtom = atom<boolean>(false);
export const AlertModalAtom = atom<boolean>(false);
export const CreateColumnAtom = atom<boolean>(false);
export const EditColumnAtom = atom<boolean>(false);
export const InvitationDashboardAtom = atom<boolean>(false);

export const AlertModalTextAtom = atom<string>("");
export const ColumnAtom = atom<{ columnId: number; title: string }>({ columnId: 0, title: "" });
export const ColumnTitlesAtom = atom<string[]>([]);
