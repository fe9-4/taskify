import { atom } from "jotai";

export const pathAtom = atom<string>((get) => {
  const value = "/";
  console.log("pathAtom initialized with:", value);
  return value;
});
