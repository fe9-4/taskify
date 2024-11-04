import { Metadata } from "next";

export const metadata: Metadata = {
  title: "계정관리",
  openGraph: {
    title: "계정관리",
  },
};

const MypageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
}

export default MypageLayout;