import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Login } from "@/zodSchema/authSchema";
import { atom, useAtom } from "jotai";
import { User } from "@/zodSchema/commonSchema";

// Jotai atom 생성
export const userAtom = atom<User | null>(null);

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useAtom(userAtom);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // React Query를 사용하여 사용자 정보 가져오기
  const {
    data: userData,
    error: userError,
    refetch: refetchUser,
    isLoading: isUserLoading,
    isFetched: isUserFetched,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get("/api/users/me");
      return response.data.user;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: false, // 쿼리를 비활성화합니다
  });

  // 사용자 데이터가 변경될 때마다 Jotai atom 업데이트
  useEffect(() => {
    if (userData) {
      setUser(userData);
    } else if (isUserFetched) {
      setUser(null);
    }
  }, [userData, isUserFetched, setUser]);

  // 사용자 데이터 가져오기 오류 처리
  useEffect(() => {
    if (axios.isAxiosError(userError) && userError.response?.status === 401) {
      setUser(null);
    } else if (userError) {
      console.error("사용자 정보 가져오기 실패:", userError);
    }
    if (userError) {
      setIsInitialLoading(false);
    }
  }, [userError, setUser]);

  // 로그인 mutation 설정
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
        // 로그인 요청 실행
        await loginMutation.mutateAsync(credentials);
        return { success: true };
      } catch (error) {
        return { success: false, message: (error as Error).message };
      }
    },
    [loginMutation]
  );

  // 로그아웃 mutation 설정
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post("/api/auth/logout", {});
    },
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      router.push("/login");
    },
    onError: (error) => {
      console.error("로그아웃 오류:", error);
    },
  });

  const logout = useCallback(() => {
    // 로그아웃 요청 실행
    logoutMutation.mutate();
  }, [logoutMutation]);

  const updateUser = useCallback(
    (updatedUserData: Partial<User>) => {
      setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedUserData } : null));
      queryClient.setQueryData(["user"], (oldData: User | undefined) =>
        oldData ? { ...oldData, ...updatedUserData } : undefined
      );
    },
    [setUser, queryClient]
  );

  useEffect(() => {
    if (isUserFetched) {
      setIsInitialLoading(false);
    }
  }, [isUserFetched]);

  return { user, refetchUser, login, logout, updateUser, isUserLoading, isUserFetched, isInitialLoading };
};
