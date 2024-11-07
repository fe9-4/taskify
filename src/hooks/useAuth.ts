import { useAtom } from "jotai";
import { useEffect } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Login } from "@/zodSchema/authSchema";
import { userAtom } from "@/store/userAtoms";

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const pathname = usePathname();

  const {
    data: userData,
    isLoading,
    isError,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const userResponse = await axios.get("/api/users/me");
        return userResponse.data.user;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  useEffect(() => {
    if (!isLoading && !isError && userData) {
      setUser(userData);
    }
  }, [userData, isLoading, isError, setUser]);

  useEffect(() => {
    if (isError) {
      console.error("인증 에러로 인한 리다이렉트:", userError);
      setUser(null);
      const publicPaths = ["/", "/login", "/signup"];
      if (!publicPaths.includes(pathname)) {
        router.push("/");
      }
    }
  }, [isError, setUser, router, pathname, userError]);

  const login = async (credentials: Login) => {
    try {
      await axios.post("/api/auth/login", credentials);
      return { success: true };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      if (pathname !== "/login" && pathname !== "/signup") {
        router.push("/login");
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    } finally {
      setUser(null);
    }
  };

  return {
    login,
    logout,
  };
};
