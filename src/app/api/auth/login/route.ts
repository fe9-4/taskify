import { Login } from "@/zodSchema/authSchema";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { apiClient } from "../../apiClient";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const loginData: Login = await request.json();
    const response = await apiClient.post("/auth/login", loginData);

    if (response.data.accessToken) {
      cookies().set("accessToken", response.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 14,
        path: "/",
      });

      return NextResponse.json({ user: response.data.user }, { status: 200 });
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
