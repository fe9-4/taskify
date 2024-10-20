import { atom } from "jotai";

interface User {
  id: string;
  nickname: string;
  email: string;
  profileImageUrl?: string;
}

// 사용자 정보를 저장하는 atom
export const userAtom = atom<User | null>(null);

export const loadingAtom = atom(false);
