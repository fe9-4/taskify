import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";
import { UpdateUserPasswordSchema } from "@/zodSchema/userSchema";

export async function PUT(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = UpdateUserPasswordSchema.parse(body);

    // 백엔드 API 요구사항에 맞게 데이터 구조 변경
    const apiRequestBody = {
      password: validatedData.currentPassword,
      newPassword: validatedData.newPassword,
    };

    const response = await apiClient.put("/auth/password", apiRequestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ message: "비밀번호가 성공적으로 변경되었습니다." }, { status: 200 });
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    return NextResponse.json({ error: "비밀번호 변경에 실패했습니다." }, { status: 500 });
  }
}
