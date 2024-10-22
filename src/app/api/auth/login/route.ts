import config from "@/constants/config";
import { Login } from "@/zodSchema/authSchema";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { apiClient } from "../../apiClient";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const loginData: Login = await request.json();
    // Taskify API를 통해 로그인 시도
    const response = await apiClient.post(`/${config.TEAM_ID}/auth/login`, loginData);

    if (response.data.accessToken) {
      // 로그인 성공 시 쿠키에 accessToken 설정
      cookies().set("accessToken", response.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1800, // 30분
        path: "/",
      });

      // 사용자 정보 반환
      return NextResponse.json(
        {
          user: {
            id: response.data.user.id,
            email: response.data.user.email,
            nickname: response.data.user.nickname,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "로그인 실패" }, { status: 401 });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(error);
      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.response.status });
      }
    }
    return NextResponse.json({ message: "로그인 실패" }, { status: 500 });
  }
};

export const GET = async () => {
  // 쿠키에서 accessToken 가져오기
  const accessToken = cookies().get("accessToken");

  if (accessToken) {
    // 사용자 정보 가져오기
    const userInfo = await axios.get("/api/user/profile", { withCredentials: true });
    return NextResponse.json({ user: userInfo.data.user });
  }

  return NextResponse.json({ accessToken: null }, { status: 200 });
};
