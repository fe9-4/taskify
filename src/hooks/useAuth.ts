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
    isLoading: isUserLoading,
    isFetched: isUserFetched,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        // 쿠키의 존재 여부를 확인
        const cookieResponse = await axios.get("/api/auth/checkCookie");

        // 쿠키가 존재하면 사용자 정보를 가져옴
        if (cookieResponse.status === 200 && cookieResponse.data.success) {
          const userResponse = await axios.get("/api/users/me");
          return userResponse.data.user;
        } else {
          // 쿠키가 없으면 null을 반환
          return null;
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error("Cookie에 accessToken이 없습니다.");
        }
        throw error;
      }
    },
    retry: 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userError) {
      // 사용자 상태를 null로 설정
      setUser(null);
      // 인증 정보가 필요없는 경로
      const publicPaths = ["/", "/login", "/signup"];
      // 로그인 상태가 아니고 현재 경로가 인증 정보가 필요한 경로면 홈으로 이동
      if (!publicPaths.includes(pathname)) {
        router.push("/");
      }
    }
  }, [userError, setUser, router, pathname]);

  useEffect(() => {
    if (!isUserLoading && !userError) {
      const userData = queryClient.getQueryData<User>(["user"]);
      setUser(userData || null);
    }
  }, [isUserLoading, userError, queryClient, setUser]);

  const loginMutation = useMutation({
    // 실제 로그인 요청을 수행하는 함수
    mutationFn: async (credentials: Login) => {
      const response = await axios.post("/api/auth/login", credentials);
      return response.data.user;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.setQueryData(["user"], data);
      // 로그인 성공 후 마이대시보드로 이동
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
    // 실제 로그아웃 요청을 수행하는 함수
    mutationFn: async () => {
      await axios.post("/api/auth/logout", {});
    },
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
      // 로그아웃 성공 후 홈으로 이동
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
    isUserLoading,
    isUserFetched,
    isInitialLoading: isUserLoading && !isUserFetched,
  };
};
