import { ReactNode } from "react";

const Section = ({ children }: { children: ReactNode }) => {
  return <section className="w-full rounded-2xl bg-white">{children}</section>;
};

export default Section;
