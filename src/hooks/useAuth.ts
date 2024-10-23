import { useCallback } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom, loadingAtom } from "@/store/userAtoms";

export const useAuth = () => {
  // jotai/utils에서 제공하는 atomWithStorage를 사용하여 사용자 정보를 localStorage에 저장
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useAtom(loadingAtom);

  const refreshUser = useCallback(
    async (forceRefresh: boolean = false) => {
      if (loading && !forceRefresh) return;
      setLoading(true);
      try {
        const response = await axios.get("/api/user/profile");
        const userData = response.data.user;
        setUser(userData);
      } catch (error) {
        console.error("사용자 정보 새로고침 실패:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    },
    [loading, setUser, setLoading]
  );

  const logout = useCallback(() => {
    setUser(null);
    // 여기에 로그아웃 API 호출 등 추가 로직을 넣을 수 있습니다.
  }, [setUser]);

  return { user, loading, setUser, refreshUser, logout };
};
