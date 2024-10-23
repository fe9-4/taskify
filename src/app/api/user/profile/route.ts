import { NextRequest, NextResponse } from "next/server";
import { UserProfileResponse } from "@/zodSchema/userSchema";
import { apiClient } from "../../apiClient";
import config from "@/constants/config";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  // 쿠키에서 accessToken 추출
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "No access token provided" }, { status: 401 });
  }

  try {
    // apiClient에 토큰 추가
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    const response = await apiClient.get<UserProfileResponse>(`/${config.TEAM_ID}/users/me`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error(error);

    // 토큰이 유효하지 않거나 만료된 경우 (예: 401 Unauthorized 응답)
    if (error.response && error.response.status === 401) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }

    // 기타 에러
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  } finally {
    // 요청 후 헤더 초기화 (선택사항)
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
