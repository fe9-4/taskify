import { Dispatch, SetStateAction } from "react";

export const PlusChip = ({ setModalOpen }: { setModalOpen: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <button
      onClick={() => setModalOpen((prev) => !prev)}
      className="flex h-5 w-5 items-center justify-center rounded bg-violet02 text-center text-base text-violet01 md:h-[22px] md:w-[22px] md:text-lg"
    >
      +
    </button>
  );
};

export const NumChip = ({ num }: { num: number }) => {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded bg-[#EEEEEE] text-center text-base text-gray01">
      {num}
    </span>
  );
};
