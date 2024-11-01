// src/store/userAtoms.ts
import { UserSchemaType } from "@/zodSchema/commonSchema";
import { atom } from "jotai";

export const userAtom = atom<UserSchemaType | null>(null);

export const loadingAtom = atom(false);
