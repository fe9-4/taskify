import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const useInvitating = (page: number) => {
  const { user } = useAuth();
  const [invitatingList, setInvitatingList] = useState([]);
  const [invitatingCount, setInvitatingCount] = useState(0);
  const size = 5;

  const fetchInvitationList = async (page: number) => {
    if (user) {
      try {
        const res = await fetch(`/api/dashboard/list?page=${page}&size=${size}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch data : ${res.status}`);
        }
        const data = await res.json();
        setInvitatingList(data.user ? data.user.invitations : []);
        setInvitatingCount(data.user.totalCount);
      } catch (err) {
        console.error(err);
      }
    }
  };
  useEffect(() => {
    fetchInvitationList(page);
  }, [user, page]);

  return { invitatingList, invitatingCount, size };
};
export default useInvitating;
