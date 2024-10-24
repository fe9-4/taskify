import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import apiClient from "../../apiClient";
import axios from "axios";

export const GET = async (req: Request) => {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  try {
    const response = await apiClient.get("/invitations", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      return NextResponse.json(response.data, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("내 대시보드 초대목록 GET api에서 오류 발생", error);
      return new NextResponse("초대목록 조회 실패", { status: error.status });
    }
  }
}