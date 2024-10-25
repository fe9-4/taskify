import apiClient from "../../apiClient";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  const { searchParams } = new URL(req.url);
  const cursorId = searchParams.get("cursorId");
  const columnId = searchParams.get("columnId");
  
  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (!cursorId || !columnId) {
    return new NextResponse("컬럼의 카드 정보를 가져오는 데이터를 확인해주세요.", { status: 400 });
  }

  try {
    const response = await apiClient.get(`/cards?size=10&cursorId=${cursorId}&columnId=${columnId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      return NextResponse.json(response.data, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("대시보드 상세페이지 카드정보 GET 요청에서 오류 발생", error);
      return new NextResponse("대시보드 상세페이지 카드정보 조회 실패", { status: error.status });
    }
  }
}