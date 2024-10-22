import { loadingAtom, userAtom } from "@/store/userAtoms";
import { useAtom } from "jotai";
import { useEffect, useCallback, useRef } from "react";
import axios from "axios";

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const lastFetchTimeRef = useRef(0);

  const loadUser = useCallback(
    async (force = false) => {
      const now = Date.now();
      if (force || now - lastFetchTimeRef.current > 5 * 60 * 1000) {
        setLoading(true);
        try {
          const { data } = await axios.get("/api/auth/login", { withCredentials: true });
          if (data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
          lastFetchTimeRef.current = now;
        } catch (error) {
          console.error("사용자 정보 로딩 실패:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    },
    [setUser, setLoading]
  );

  useEffect(() => {
    loadUser(true);
  }, [loadUser]);

  return { user, loading, setUser, refreshUser: () => loadUser(true) };
};
