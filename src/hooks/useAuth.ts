import { useAtom } from "jotai";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { Login } from "@/zodSchema/authSchema";
import { userAtom } from "@/store/userAtoms";

export const useAuth = () => {
  const router = useRouter();
  const [, setUser] = useAtom(userAtom);
  const pathname = usePathname();

  const login = async (credentials: Login) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      if (pathname !== "/login" && pathname !== "/signup") {
        router.push("/login");
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    } finally {
      setUser(null);
    }
  };

  return {
    login,
    logout,
  };
};
