import { NextRequest, NextResponse } from "next/server";
import { UserProfileResponse } from "@/zodSchema/userSchema";
import { apiClient } from "../../apiClient";
import config from "@/constants/config";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Authorization 헤더에서 토큰 추출
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // 토큰이 없거나 형식이 잘못된 경우
    return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    // apiClient에 토큰 추가
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
}
