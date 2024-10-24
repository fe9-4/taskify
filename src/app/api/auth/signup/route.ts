import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "../../apiClient";
import { Signup, SignupResponse } from "@/zodSchema/userSchema";
import { AxiosError } from "axios";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const signupData: Signup = await request.json();
    const response = await apiClient.post<SignupResponse>("/users/", signupData);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(error);

      if (error.response) {
        // 409 상태 코드에 대한 특별한 처리
        if (error.response.status === 409) {
          return NextResponse.json({ message: "이미 사용중인 이메일입니다." }, { status: 409 });
        }
        return NextResponse.json({ message: error.response.data.message }, { status: error.response.status });
      }
    }

    return NextResponse.json({ message: "회원가입 실패" }, { status: 500 });
  }
};
