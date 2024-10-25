import { useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Login } from "@/zodSchema/authSchema";
import { atom, useAtom } from "jotai";
import { User } from "@/zodSchema/commonSchema";

// Jotai atom 생성
export const userAtom = atom<User | null>(null);

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useAtom(userAtom);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get("/api/users/me");
      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUser(null);
      } else {
        console.error("Failed to fetch user:", error);
      }
    }
  }, [setUser]);

  const login = useCallback(
    async (credentials: Login) => {
      try {
        const response = await axios.post("/api/auth/login", credentials);
        setUser(response.data.user);
        router.push("/mydashboard");
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    [setUser, router]
  );

  const logout = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout", {});
      setUser(null);
      queryClient.clear();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [setUser, queryClient, router]);

  const updateUser = useCallback(
    (updatedUserData: Partial<User>) => {
      setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedUserData } : null));
    },
    [setUser]
  );

  return { user, fetchUser, login, logout, updateUser };
};
