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
        switch (error.response.status) {
          case 400:
            return NextResponse.json({ message: "이메일 형식으로 작성해주세요." }, { status: 400 });
          case 401:
            return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });
          case 404:
            return NextResponse.json({ message: "존재하지 않는 유저입니다." }, { status: 404 });
        }
      }
    }

    // 기타 에러 처리
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}
