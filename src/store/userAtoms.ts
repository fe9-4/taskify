import { User } from "@/zodSchema/commonSchema";
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// 로그인 상태 유지를 위해 사용자 정보를 localStorage에 저장
export const userAtom = atomWithStorage<User | null>(
  "user",
  null,
  createJSONStorage(() => localStorage)
);

export const loadingAtom = atom(false);
