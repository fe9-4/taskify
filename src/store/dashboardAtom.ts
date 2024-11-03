import { ICard, ICurrentColumn } from "@/types/dashboardType";
import { atom } from "jotai";

export const dashboardCardUpdateAtom = atom(false);

export const currentColumnListAtom = atom<ICurrentColumn[]>([]);

export interface ColumnCards {
  [columnId: number]: {
    cards: ICard["cards"];
    hasMore: boolean;
    cursorId: number | null;
    totalCount: number;
  };
}

export const columnCardsAtom = atom<ColumnCards>({});