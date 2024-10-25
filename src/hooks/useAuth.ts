import { useCallback, useEffect } from "react";
import axios from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import { userAtom, loadingAtom } from "@/store/userAtoms";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Login } from "@/zodSchema/authSchema";

export const useAuth = () => {
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const setLoading = useSetAtom(loadingAtom);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await axios.get("/api/user/profile");
      return response.data?.user;
    },
    enabled: !user,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유효
    retry: false, // 실패 시 재시도하지 않음
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    } else if (!isLoading) {
      setUser(null);
    }
  }, [userData, setUser, isLoading]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const clearUserData = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const login = useCallback(
    async (credentials: Login) => {
      try {
        const response = await axios.post("/api/auth/login", credentials, { withCredentials: true });
        setUser(response.data.user); // 로그인 후 사용자 정보 업데이트
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }); // 사용자 정보 쿼리 무효화
        router.push("/"); // 로그인 후 리다이렉트
      } catch (error) {
        console.error("로그인 오류:", error);
      }
    },
    [setUser, queryClient, router]
  );

  const logout = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      clearUserData();
      queryClient.clear();
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  }, [clearUserData, router, queryClient]);

  const updateUser = useCallback(
    (updatedUserData: Partial<typeof user>) => {
      setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedUserData } : null));
    },
    [setUser]
  );

  return { user, loading: isLoading, setUser, login, logout, updateUser };
};
