import axios from "axios";
import apiClient from "../apiClient";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// 대시보드페이지 컬럼 조회
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const dashboardId = searchParams.get("dashboardId");
  const id = Number(dashboardId);

  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return new NextResponse("사용자 정보를 찾을 수 없습니다.", { status: 401 });
  }

  if (isNaN(id)) {
    return new NextResponse("대시보드 정보 가져오기 실패", { status: 400 });
  }

  try {
    const response = await apiClient.get(`/columns?dashboardId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = response.data.data;
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("대시보드 상세페이지 GET 요청에서 오류 발생", error);
      return new NextResponse("대시보드 조회 실패", { status: error.status });
    }
  }
};

// 대시보드 생성
export const POST = async (request: NextRequest) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "인증되지 않은 사용자" }, { status: 401 });
  }

  try {
    const formData = await request.json();
    const response = await apiClient.post("/columns", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ user: response.data }, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new NextResponse(JSON.stringify({ message: "컬럼 생성 실패" }), { status: error.status });
    }
  }
};
