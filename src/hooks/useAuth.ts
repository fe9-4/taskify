import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Login } from "@/zodSchema/authSchema";
import { UserSchemaType } from "@/zodSchema/commonSchema";
import { userAtom } from "@/store/userAtoms";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useAtom(userAtom);

  const login = async (credentials: Login) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      if (response.status === 200) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const logout = () => {
    axios.post("/api/auth/logout");
    setUser(null);
  };

  return {
    login,
    logout,
  };
};
