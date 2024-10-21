import { loadingAtom, userAtom } from "@/store/userAtoms";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { UserProfileResponse } from "@/zodSchema/userSchema";

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useAtom(loadingAtom);

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      try {
        // TODO 로컬 스토리지에서 토큰 가져오기(Cookie 로 바뀔 수 있음)
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("인증 토큰이 없습니다.");
          setUser(null);
          return;
        }

        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const userData: UserProfileResponse = await response.json();
          setUser(userData.user);
        } else {
          console.error("사용자 프로필 로딩 실패:", response.statusText);
          setUser(null);
        }
      } catch (error) {
        console.error("사용자 프로필 로딩 실패:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [setUser, setLoading]);

  return { user, loading };
}
