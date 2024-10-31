import { Metadata } from "next";
import "../styles/globals.css";
import { Montserrat } from "next/font/google";
import Header from "@/components/header/Header";
import ModalContainer from "@/components/modal/ModalContainer";
import ClientLayout from "./childrenLayout";
import Sidebar from "@/components/sidebar/Sidebar";

const montserrat = Montserrat({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Taskify",
    default: "새로운 일정관리 | Taskify",
  },
  description: "새로운 일정관리 | Taskify",
  icons: { icon: "/icons/favicon.ico", shortcut: "/icons/favicon.ico" },
  metadataBase: new URL("http://localhost:3000/"),
  openGraph: {
    title: {
      template: "%s | Taskify",
      default: "새로운 일정관리 | Taskify",
    },
    description: "새로운 일정관리 | Taskify",
    images: "/icons/favicon.ico",
    url: "http://localhost:3000/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${montserrat.variable} font-pretendard min-h-screen text-black03`}>
        <div id="modal-root"></div>
        <ClientLayout>
          <ModalContainer />
          <Sidebar />
          <Header />
          <main className="pt-[60px] md:pt-[70px]">{children}</main>
        </ClientLayout>
      </body>
    </html>
  );
}
