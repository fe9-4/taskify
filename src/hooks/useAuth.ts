import { loadingAtom, userAtom } from "@/store/userAtoms";
import { useAtom } from "jotai";
import { useEffect, useCallback } from "react";
import { UserProfileResponse } from "@/zodSchema/userSchema";
import apiClient from "@/app/api/apiClient";
import axios from "axios";
import { useThrottle } from "./useThrottle";

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useAtom(loadingAtom);

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { accessToken },
      } = await axios.get("/api/auth/cookie/getCookie", { withCredentials: true });

      if (!accessToken) {
        setUser(null);
        return;
      }

      const { data: userData } = await apiClient.get<UserProfileResponse>("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(userData.user);
    } catch (error) {
      console.error("사용자 프로필 로딩 실패:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  const throttledLoadUser = useThrottle(loadUser, 5000); // 5초마다 실행

  useEffect(() => {
    throttledLoadUser();
  }, [throttledLoadUser]);

  return { user, loading, setUser };
}
