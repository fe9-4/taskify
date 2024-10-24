import { useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import { userAtom, loadingAtom } from "@/store/userAtoms";

export const useAuth = () => {
  // Jotai의 useAtomValue로 사용자 상태 값 가져오기
  const user = useAtomValue(userAtom);
  // Jotai의 useSetAtom으로 사용자 상태 설정 함수 가져오기
  const setUser = useSetAtom(userAtom);
  // 로딩 상태 값 가져오기
  const loading = useAtomValue(loadingAtom);
  // 로딩 상태 설정 함수 가져오기
  const setLoading = useSetAtom(loadingAtom);
  // 사용자 정보를 새로 고침했는지 여부를 저장하는 ref
  const hasAttemptedRefreshRef = useRef(false);

  // 사용자 데이터를 초기화하는 함수
  const clearUserData = useCallback(() => {
    setUser(null); // 사용자 상태를 null로 설정
  }, [setUser]); // setUser에 의존

  // 사용자 정보를 새로 고치는 함수
  const refreshUser = useCallback(async () => {
    // 이미 로딩 중이거나 새로 고침을 시도한 적이 있으면 함수 종료
    if (loading || hasAttemptedRefreshRef.current) return;
    setLoading(true); // 로딩 상태를 true로 설정
    hasAttemptedRefreshRef.current = true; // 새로 고침 시도 표시
    try {
      // 서버로부터 사용자 정보 가져오기
      const response = await axios.get("/api/auth/login");
      console.log("서버 응답 데이터:", response.data);

      // 서버 응답 데이터에서 실제 사용자 정보 추출
      let userData;
      if (response.data?.user) {
        // 응답 구조가 { user: { ... } } 인 경우
        userData = response.data.user;
      } else {
        // 사용자 정보가 없으면 데이터 초기화
        console.log("사용자 정보가 없음");
        clearUserData();
        return;
      }

      // 사용자 정보가 있으면 상태 업데이트
      setUser(userData);
    } catch (error) {
      // 에러 발생 시 데이터 초기화
      console.error("사용자 정보 새로고침 실패:", error);
      clearUserData();
    } finally {
      setLoading(false); // 로딩 상태를 false로 설정
    }
  }, [setUser, setLoading, clearUserData, loading]); // 의존성 배열에 필요한 의존성 포함

  // 컴포넌트 마운트 시 사용자 정보 새로 고침 실행
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // 인증 상태를 초기화하는 함수
  const resetAuthState = useCallback(() => {
    hasAttemptedRefreshRef.current = false; // 새로 고침 시도 여부 초기화
    refreshUser(); // 사용자 정보 새로 고침
  }, [refreshUser]);

  return { user, loading, setUser, resetAuthState };
};
