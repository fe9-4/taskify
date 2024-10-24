import { useCallback, useEffect } from "react";
import axios from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import { userAtom, loadingAtom } from "@/store/userAtoms";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const setLoading = useSetAtom(loadingAtom);
  const router = useRouter();

  // 사용자 정보를 가져오는 React Query 사용
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await axios.get("/api/user/profile");
      return response.data?.user;
    },
    enabled: !user,
    staleTime: 1000 * 60 * 5,
    throwOnError: (error) => {
      console.error("사용자 정보를 가져오는 데 실패했습니다:", error);
      setUser(null);
      return false;
    },
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    } else if (!isLoading) {
      setUser(null);
    }
  }, [userData, setUser, isLoading]);

  // 로딩 상태 업데이트
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const clearUserData = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const logout = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      clearUserData();
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  }, [clearUserData, router]);

  const updateUser = useCallback(
    (updatedUserData: Partial<typeof user>) => {
      setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedUserData } : null));
    },
    [setUser]
  );

  return { user, loading: isLoading, setUser, logout, updateUser };
};
