export const PlusChip = () => {
  return (
    <span className="flex size-5 items-center justify-center rounded bg-violet02 text-center text-base text-violet01 md:size-[22px] md:text-lg">
      +
    </span>
  );
};

export const NumChip = ({ num }: { num: number }) => {
  return (
    <span className="flex size-5 items-center justify-center rounded bg-[#EEEEEE] text-center text-base text-gray01">
      {num}
    </span>
  );
};
