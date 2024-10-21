export const PlusChip = () => {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded bg-violet02 text-center text-base text-violet01 md:h-[22px] md:w-[22px] md:text-lg">
      +
    </span>
  );
};

export const NumChip = ({ num }: { num: number }) => {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded bg-[#EEEEEE] text-center text-base text-gray01">
      {num}
    </span>
  );
};
