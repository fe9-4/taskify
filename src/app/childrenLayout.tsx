"use client";

import { PropsWithChildren, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const [marginClass, setMarginClass] = useState("");

  // 특정 경로에서는 마진을 0으로 설정
  useEffect(() => {
    if (["/login", "/signup", "/"].includes(pathname)) {
      setMarginClass("");
    } else {
      setMarginClass("xl:ml-[300px] md:ml-[160px] ml-[67px]");
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        {/* HydrationBoundary에서 상태를 전달할 때, 서버 측에서 미리 받아올 데이터 사용을 고려 */}
        <HydrationBoundary>
          <div className={marginClass}>{children}</div>
          <Toaster />
        </HydrationBoundary>
      </Provider>
    </QueryClientProvider>
  );
}
