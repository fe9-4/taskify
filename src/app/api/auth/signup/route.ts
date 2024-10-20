import { NextRequest, NextResponse } from "next/server";
import config from "@/constants/config";
import { apiClient } from "../../apiClient";
import { Signup, SignupResponse } from "@/zodSchema/userSchema";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const signupData: Signup = await request.json();
    const response = await apiClient.post<SignupResponse>(`/${config.TEAM_ID}/users/`, signupData);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
