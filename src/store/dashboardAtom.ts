import { ICurrentColumn } from "@/types/dashboardType";
import { atom } from "jotai";

export const dashboardCardUpdateAtom = atom(false);

export const currentColumnListAtom = atom<ICurrentColumn[]>([]);

export const currentColumnIdAtom = atom();