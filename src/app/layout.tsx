import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "코드잇 프론트엔드 9기 4팀 프로젝트",
  description: "코드잇 프론트엔드 9기 4팀 프로젝트입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
