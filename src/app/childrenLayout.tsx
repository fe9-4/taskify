"use client";

import { PropsWithChildren, useState } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  // 특정 경로에서는 마진을 0으로 설정
  const marginClass = ["/login", "/signup", "/"].includes(pathname) ? "" : "xl:ml-[300px] md:ml-[160px] ml-[67px]";

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <div className={marginClass}>{children}</div>
        <Toaster />
      </Provider>
    </QueryClientProvider>
  );
}
