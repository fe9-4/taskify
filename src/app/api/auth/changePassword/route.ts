import { NextRequest, NextResponse } from "next/server";
import { ChangePassword } from "@/zodSchema/authSchema";
import { apiClient } from "../../apiClient";

export const PUT = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const changePassword: ChangePassword = await request.json();
    await apiClient.put("/auth/password", changePassword);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "비밀번호 변경 실패" }, { status: 500 });
  }
};
