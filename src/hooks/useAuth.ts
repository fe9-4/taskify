import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Login } from "@/zodSchema/authSchema";
import { User } from "@/zodSchema/commonSchema";
import { userAtom } from "@/store/userAtoms";

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [user, setUser] = useAtom(userAtom);

  const {
    data: userData,
    isLoading,
    isFetching,
    isError,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const cookieResponse = await axios.get("/api/auth/checkCookie");

        if (cookieResponse.status === 200 && cookieResponse.data.success) {
          const userResponse = await axios.get("/api/users/me");
          return userResponse.data.user;
        }
        return null;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error("Cookie에 accessToken이 없습니다.");
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && !isError) {
      setUser(userData);
    }
  }, [userData, isLoading, isError, setUser]);

  useEffect(() => {
    if (isError) {
      setUser(null);
      const publicPaths = ["/", "/login", "/signup"];
      if (!publicPaths.includes(pathname)) {
        router.push("/");
      }
    }
  }, [isError, setUser, router, pathname]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: Login) => {
      const response = await axios.post("/api/auth/login", credentials);
      return response.data.user;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(["user"], data);
      router.push("/mydashboard");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "로그인에 실패했습니다.");
      }
      throw new Error("로그인 중 오류가 발생했습니다.");
    },
  });

  const login = useCallback(
    async (credentials: Login) => {
      try {
        await loginMutation.mutateAsync(credentials);
        return { success: true };
      } catch (error) {
        return { success: false, message: (error as Error).message };
      }
    },
    [loginMutation]
  );

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post("/api/auth/logout", {});
    },
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
      router.push("/");
    },
    onError: (error) => {
      console.error("로그아웃 오류:", error);
    },
  });

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const updateUser = useCallback(
    (updatedUserData: Partial<User>) => {
      setUser((oldUser) => (oldUser ? { ...oldUser, ...updatedUserData } : null));
      queryClient.setQueryData(["user"], (oldData: User | undefined) =>
        oldData ? { ...oldData, ...updatedUserData } : undefined
      );
    },
    [queryClient, setUser]
  );

  return {
    user,
    login,
    logout,
    updateUser,
    isLoading,
    isFetching,
    isError,
    isInitialLoading: isLoading && !user,
  };
};
