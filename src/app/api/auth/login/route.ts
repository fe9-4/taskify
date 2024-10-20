import config from "@/constants/config";
import { Login } from "@/zodSchema/authSchema";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { apiClient } from "../../apiClient";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const loginData: Login = await request.json();
    const response = await apiClient.post(`/${config.TEAM_ID}/auth/login`, loginData);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(error);

      // AxiosError 관련 처리
      if (error.response) {
        // API 서버에서 전송한 메시지를 그대로 사용
        return NextResponse.json({ message: error.response.data.message }, { status: error.response.status });
      }
    }

    // 기타 에러 처리
    return NextResponse.json({ error: "로그인 실패" }, { status: 500 });
  }
}
