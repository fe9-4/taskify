import { Metadata } from "next";
<<<<<<< HEAD
import "./globals.css";
import Header from "@/components/Header";
=======
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
>>>>>>> develop

export const metadata: Metadata = {
  title: {
    template: "%s | Taskify",
    default: "새로운 일정관리 | Taskify"
  },
  description: "새로운 일정관리 | Taskify",
  icons: { icon: "/icons/favicon.ico", shortcut: "/icons/favicon.ico"}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
<<<<<<< HEAD
      <body>
        <Header />
=======
      <body className="min-h-screen font-pretendard text-black03">
>>>>>>> develop
        {children}
        <Toaster toastOptions={{ success: {style: { fontSize: "14px" }}, error: {style: { fontSize: "14px" }} }} />
      </body>
    </html>
  );
}
