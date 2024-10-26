import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiClient from "@/app/api/apiClient";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json({ error: "이미지 파일이 없습니다." }, { status: 400 });
    }

    // FormData 객체를 그대로 전달
    const response = await apiClient.post("/users/me/image", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json({ profileImageUrl: response.data.profileImageUrl }, { status: 200 });
  } catch (error) {
    console.error("프로필 이미지 업로드 실패:", error);
    return NextResponse.json({ error: "프로필 이미지 업로드 실패" }, { status: 500 });
  }
}
