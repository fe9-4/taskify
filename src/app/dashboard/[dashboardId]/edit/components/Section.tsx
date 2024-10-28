import { ReactNode } from "react";

const Section = ({ children }: { children: ReactNode }) => {
  return <section className="mx-4 my-5 w-full rounded-2xl bg-white md:mx-7 md:my-8">{children}</section>;
};

export default Section;
