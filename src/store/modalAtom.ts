import { atom } from "jotai";

interface CreateCardAtomType {
  isOpen: boolean;
  columnId: number | null;
}

export const CreateCardAtom = atom<CreateCardAtomType>({
  isOpen: false,
  columnId: null,
});

export const CreateDashboardAtom = atom(false);
export const AlertModalAtom = atom(false);

export const AlertModalTextAtom = atom("");

export const UpdateCardAtom = atom(false);
