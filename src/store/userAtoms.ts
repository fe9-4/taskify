// src/store/userAtoms.ts
import { User } from "@/zodSchema/commonSchema";
import { atom } from "jotai";

export const userAtom = atom<User | null>(null);

export const loadingAtom = atom(false);
