import { NextRequest, NextResponse } from "next/server";
import config from "@/constants/config";
import { apiClient } from "../../apiClient";
import { Signup, SignupResponse } from "@/zodSchema/userSchema";
import { AxiosError } from "axios";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const signupData: Signup = await request.json();
    const response = await apiClient.post<SignupResponse>(`/${config.TEAM_ID}/users/`, signupData);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(error);

      if (error.response) {
        return NextResponse.json({ message: error.response.data.message }, { status: error.response.status });
      }
    }

    return NextResponse.json({ message: "회원가입 실패" }, { status: 500 });
  }
}
