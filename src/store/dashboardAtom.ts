import { ICurrentColumn, ICard } from "@/types/dashboardType";
import { atom } from "jotai";

export const myDashboardIdAtom = atom<number | null>(null);

export const dashboardCardUpdateAtom = atom(false);

export const currentDashboardIdAtom = atom<string | null>(null);

export const currentColumnListAtom = atom<ICurrentColumn[]>([]);

export const resetColumnListAtom = atom(null, (get, set, dashboardId: string) => {
  set(currentDashboardIdAtom, dashboardId);
  set(currentColumnListAtom, []);
});

export interface ColumnCards {
  [columnId: number]: {
    cards: ICard["cards"];
    hasMore: boolean;
    cursorId: number | null;
    totalCount: number;
  };
}

export const columnCardsAtom = atom<ColumnCards>({});
