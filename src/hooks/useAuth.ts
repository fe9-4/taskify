import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Login } from "@/zodSchema/authSchema";
import { User } from "@/zodSchema/commonSchema";

// 사용자 상태를 위한 atom 생성
const userAtom = atom<User | null>(null);

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useAtom(userAtom);

  const {
    error: userError,
    isLoading: isUserLoading,
    isFetched: isUserFetched,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axios.get("/api/users/me");
      setUser(response.data.user);
      return response.data.user;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

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
      router.push("/login");
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
