"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "jotai";
import { Toaster } from "react-hot-toast";
import Loading from "./loading";

export default function ClientLayout({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const router = useRouter();
  const marginClass = ["/login", "/signup", "/"].includes(pathname) ? "" : "xl:ml-[300px] md:ml-[160px] ml-[67px]";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/checkCookie");
        const data = await response.json();
        setIsAuthenticated(data.success);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const publicPaths = ["/", "/login", "/signup"];

    if (!isLoading && isAuthenticated === false && !publicPaths.includes(pathname)) {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HydrationBoundary>
          <div className={marginClass}>{children}</div>
          <Toaster />
        </HydrationBoundary>
      </Provider>
    </QueryClientProvider>
  );
}
