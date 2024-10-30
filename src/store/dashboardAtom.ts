import { atom } from "jotai";

export const dashboardCardUpdateAtom = atom(false);

export const currentColumnTitleAtom = atom<string[]>([]);

export const currentColumnIdAtom = atom();